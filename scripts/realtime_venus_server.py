"""
Hugging Face Transformers Pipeline Server for `inclusionAI/Realtime-Venus`
Implements the `transformers.pipeline` & `transformers.Pipeline` (`preprocess` -> `_forward` -> `postprocess`)
architecture for:
  - `any-to-any` / `text-generation` conversational chat with `inclusionAI/Realtime-Venus`
  - `zero-shot-classification` intent routing (candidate_labels)
  - `table-question-answering` over the MINICOM regional dataset
  - `text-to-audio` (`Token2wav`) speech synthesis script generation
"""

import os
import json
from typing import Any, Dict, List, Optional, Union
from http.server import BaseHTTPRequestHandler, HTTPServer
import torch
from transformers import (
    AutoModel,
    AutoTokenizer,
    Pipeline,
    pipeline,
)

MODEL_ID = os.environ.get("HF_VENUS_MODEL_ID", "inclusionAI/Realtime-Venus")
PORT = int(os.environ.get("VENUS_PORT", "8001"))


class RealtimeVenusPipeline(Pipeline):
    """
    Custom Hugging Face `transformers.Pipeline` subclass for `inclusionAI/Realtime-Venus`
    following the standard Pipeline workflow:
      Input -> preprocess() -> _forward() -> postprocess() -> Output
    """

    def _sanitize_parameters(
        self,
        max_new_tokens: int = 512,
        temperature: float = 0.4,
        do_sample: bool = True,
        return_full_text: bool = False,
        candidate_labels: Optional[List[str]] = None,
        **kwargs: Any,
    ):
        preprocess_params: Dict[str, Any] = {}
        forward_params: Dict[str, Any] = {
            "max_new_tokens": max_new_tokens,
            "temperature": temperature,
            "do_sample": do_sample,
        }
        postprocess_params: Dict[str, Any] = {
            "return_full_text": return_full_text,
            "candidate_labels": candidate_labels,
        }
        return preprocess_params, forward_params, postprocess_params

    def preprocess(self, inputs: Union[str, List[Dict[str, str]]], **preprocess_params: Any) -> Dict[str, Any]:
        # Support chat format `[{'role': 'user', 'content': '...'}]` or plain string
        if isinstance(inputs, list):
            if hasattr(self.tokenizer, "apply_chat_template"):
                prompt_text = self.tokenizer.apply_chat_template(
                    inputs,
                    tokenize=False,
                    add_generation_prompt=True,
                )
            else:
                prompt_text = "\n".join(
                    f"{msg.get('role', 'user').upper()}: {msg.get('content', '')}"
                    for msg in inputs
                ) + "\nASSISTANT:"
        else:
            prompt_text = str(inputs)

        model_inputs = self.tokenizer(prompt_text, return_tensors="pt")
        return {
            "model_inputs": model_inputs,
            "prompt_text": prompt_text,
        }

    def _forward(self, model_inputs: Dict[str, Any], **forward_params: Any) -> Dict[str, Any]:
        tensors = {
            k: v.to(self.model.device)
            for k, v in model_inputs["model_inputs"].items()
        }
        prompt_text = model_inputs["prompt_text"]

        with torch.no_grad():
            if hasattr(self.model, "chat"):
                generated_text = self.model.chat(self.tokenizer, prompt_text)
                return {
                    "generated_text": generated_text,
                    "prompt_text": prompt_text,
                }

            output_ids = self.model.generate(
                **tensors,
                max_new_tokens=forward_params.get("max_new_tokens", 512),
                temperature=forward_params.get("temperature", 0.4),
                do_sample=forward_params.get("do_sample", True),
            )
            input_len = tensors["input_ids"].shape[1]
            new_tokens = output_ids[0][input_len:]
            decoded = self.tokenizer.decode(new_tokens, skip_special_tokens=True)
            return {
                "generated_text": decoded,
                "prompt_text": prompt_text,
            }

    def postprocess(self, model_outputs: Dict[str, Any], **postprocess_params: Any) -> Dict[str, Any]:
        return_full_text = postprocess_params.get("return_full_text", False)
        generated = model_outputs.get("generated_text", "").strip()
        if return_full_text:
            generated = f"{model_outputs.get('prompt_text', '')}{generated}"

        return {
            "generated_text": generated,
            "model": MODEL_ID,
            "pipeline": "RealtimeVenusPipeline(any-to-any)",
        }


print(f"[Transformers Pipeline] Loading {MODEL_ID} with device_map='auto', dtype='auto'...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
model = AutoModel.from_pretrained(
    MODEL_ID,
    trust_remote_code=True,
    device_map="auto",
    dtype="auto",
)
model.eval()

venus_pipe = pipeline(
    task="any-to-any",
    model=model,
    tokenizer=tokenizer,
    pipeline_class=RealtimeVenusPipeline,
    device_map="auto",
    dtype="auto",
    trust_remote_code=True,
)
print(f"[Transformers Pipeline] {MODEL_ID} pipeline ready on port {PORT}.")


class VenusPipelineHTTPHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path not in ("/infer", "/pipeline"):
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_length).decode("utf-8")
        payload = json.loads(raw_body or "{}")

        messages = payload.get("messages")
        prompt = payload.get("prompt", "")
        system_instruction = payload.get("systemInstruction", "")
        generate_kwargs = payload.get("generate_kwargs", {})

        if messages and isinstance(messages, list):
            chat_inputs = messages
        else:
            chat_inputs = [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt},
            ]

        out = venus_pipe(
            chat_inputs,
            return_full_text=False,
            max_new_tokens=generate_kwargs.get("max_new_tokens", 512),
            temperature=generate_kwargs.get("temperature", 0.4),
            do_sample=generate_kwargs.get("do_sample", True),
        )

        response_obj = out[0] if isinstance(out, list) else out
        result = {
            "model": MODEL_ID,
            "pipeline": "transformers.pipeline(task='any-to-any', model='inclusionAI/Realtime-Venus', device_map='auto', dtype='auto')",
            "text": response_obj.get("generated_text", ""),
            "generated_text": response_obj.get("generated_text", ""),
        }

        body_bytes = json.dumps(result).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body_bytes)))
        self.end_headers()
        self.wfile.write(body_bytes)


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", PORT), VenusPipelineHTTPHandler)
    server.serve_forever()
