import multiprocessing

from langchain_community.chat_models import ChatLlamaCpp
import controlflow as cf
import random
from pydantic import BaseModel


model = ChatLlamaCpp(
    temperature=0.8,
    model_path="/mnt/Meta-Llama-3.1-8B-Instruct-Q8_0.gguf",
    n_ctx=8192,
    n_gpu_layers=33,
    n_batch=2048, 
    n_threads=multiprocessing.cpu_count() - 1,
    repeat_penalty=1.5,
    verbose=False
    #grammar_path="/mnt/llama.cpp/grammars/json.gbnf"
)

cf.defaults.model = model


from langchain_core.utils.function_calling import convert_to_openai_tool
from pydantic import BaseModel


class Joke(BaseModel):
    """A setup to a joke and the funny punchline."""
    setup: str
    punchline: str


dict_schema = convert_to_openai_tool(Joke)
structured_llm = model.with_structured_output(dict_schema)
result = structured_llm.invoke("can you come up with a joke about science?")
print(result)




