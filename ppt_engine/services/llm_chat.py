import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from openai import AsyncOpenAI
from dotenv import load_dotenv
from utils.prompts import system_prompt
load_dotenv()

async def chat(prompt: str):
    client = AsyncOpenAI(
        api_key=os.getenv("MIMO_API_KEY"),
        base_url="https://api.xiaomimimo.com/v1"
    )

    completion = await client.chat.completions.create(
        model="mimo-v2.5",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        extra_body={
            "thinking": {
                "type": "disabled"
            }
        },
        max_completion_tokens=4096,
        temperature=0.5,
        top_p=0.9,
        stream=False,
        stop=None,
        frequency_penalty=0,
        presence_penalty=0
    )

    return completion.choices[0].message.content
