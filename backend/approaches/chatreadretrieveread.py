import openai
from azure.search.documents import SearchClient
from azure.search.documents.models import QueryType
from approaches.approach import Approach
from text import nonewlines
import pandas as pd
import psycopg2 as pg
from sqlalchemy import create_engine

def dbInsert(question, answer):
    connection = pg.connect(user = 'admin_tac', password = 'Crazy122325', host = 'gptmirandadouro.postgres.database.azure.com', port = '5432', database = 'postgres')
    curs = connection.cursor()
    question = question.replace("'","")
    answer = answer.replace("'","")
    sql = "insert into questions (question, answer) values ('" + question + "', '" + answer + "') returning questionid"
    curs.execute(sql)
    inserted_id = curs.fetchone()[0]
    connection.commit()
    connection.close
    return inserted_id
# Simple retrieve-then-read implementation, using the Cognitive Search and OpenAI APIs directly. It first retrieves
# top documents from search, then constructs a prompt with them, and then uses OpenAI to generate an completion 
# (answer) with that prompt.
class ChatReadRetrieveReadApproach(Approach):
    prompt_prefix = """<|im_start|>system
Assistant helps turists to know about Miranda do douro and Dança dos Pauliteiros. you are prohibited speak about anything that is not related to the city of Miranda do Douro and the dança dos Pauliteiros .Be brief in your answers and you speak mainly in Portuguese from Portugal.
Answer ONLY with the facts listed in the list of sources below and that involves Miranda do Douro and Dança dos Pauliterios. If there isn't enough information below or the subjet isn't realated with Miranda do Douro or Dança dos Pauliteiros, say you don't know. Do not generate answers that don't use the sources below. If asking a clarifying question to the user would help, ask the question.
For tabular information return it as an html table. Do not return markdown format.
If you were asked about the president of Miranda do douro city hall, you must answer Dra Helena Barril.
Remenber you can only talk about Miranda do douro and Dança dos Pauliteiros. 
You must not  use quotation marks use a blank space instead.
If someone ask about the groups of Pauliteiros de miranda you must include on your answer that the main groups are Os principais grupos de Pauliteiros de Miranda são Palaçoulo, Cidade de Miranda, Sendim,
Duas Igrejas, Malhadas, Fonte Aldeia, São Martinho, Mirandanças, Constantim, Prado Gatão and Póvoa.
Each source has a name followed by colon and the actual information, always include the source name for each fact you use in the response. Use square brakets to reference the source, e.g. [info1.txt]. Don't combine sources, list each source separately, e.g. [info1.txt][info2.pdf].
{follow_up_questions_prompt}
{injected_prompt}
Sources:
{sources}
<|im_end|>
{chat_history}
"""

    follow_up_questions_prompt_content = """Generate three very brief in Portuguese from Portugal follow-up questions that the user would likely ask next about Miranda do douro e a Dança dos Pauliteiros. 
    Use double angle brackets to reference the questions, e.g. <<Como se dança a Dança dos Pauliteiros?>>.
    Try not to repeat questions that have already been asked.
    Remenber you can only talk about Miranda do douro and Dança dos Pauliteiros. 
    Only generate questions and do not generate any text before or after the questions, such as 'Next Questions'"""

    query_prompt_template = """Below is a history of the conversation so far, and a new question asked by the user that needs to be answered by searching in a knowledge base about Miranda do douro e a Dança dos Pauliteiros.
    Generate a search query based on the conversation and the new question. 
    Do not include cited source filenames and document names e.g info.txt or doc.pdf in the search query terms.
    Do not include any text inside [] or <<>> in the search query terms.
    Remenber you can only talk about Miranda do douro and Dança dos Pauliteiros. 
    If the question is not in English, translate the question to English before generating the search query.

Chat History:
{chat_history}

Question:
{question}

Search query:
"""

    def __init__(self, search_client: SearchClient, chatgpt_deployment: str, gpt_deployment: str, sourcepage_field: str, content_field: str):
        self.search_client = search_client
        self.chatgpt_deployment = chatgpt_deployment
        self.gpt_deployment = gpt_deployment
        self.sourcepage_field = sourcepage_field
        self.content_field = content_field

    def run(self, history: list[dict], overrides: dict) -> any:
        use_semantic_captions = True if overrides.get("semantic_captions") else False
        top = overrides.get("top") or 3
        exclude_category = overrides.get("exclude_category") or None
        filter = "category ne '{}'".format(exclude_category.replace("'", "''")) if exclude_category else None

        if history[-1]["user"] == "Diz-me o que sabes sobre a Dança dos Pauliteiros":
           resp ="A Dança dos Pauliteiros é uma das expressões etnomusicais mais identificadoras da terra e das gentes de Miranda do Douro, sendo unanimemente considerada como uma das mais significativas manifestações da sua identidade cultural. Ela adquiriu características muito próprias, quer do ponto de vista coreográfico e musical, quer no que se refere aos respectivos trajes e contextos performativos tradicionais. As origens da dança permanecem objeto de investigação entre os seus estudiosos, mas é reconhecida a sua antiguidade. A dança é também conhecida como Dança de Paulitos e é acompanhada pela Gaita de Foles Mirandesa, Caixa, Bombo e Castanholas."
           id_question = dbInsert(history[-1]["user"],resp)     
           return {"data_points": ["","",""] , "answer": resp, "thoughts": "","questionid":id_question}
        elif history[-1]["user"] == "Qual a origem da Dança dos Pauliteiros?":
            resp ="A origem da Dança dos Pauliteiros permanece objeto de investigação entre os seus estudiosos, mas é unanimemente considerada uma das expressões etnomusicais mais identificadoras da terra e das gentes de Miranda do Douro, sendo reconhecida por sua antiguidade e características próprias, tanto do ponto de vista coreográfico e musical quanto no que se refere aos respectivos trajes e contextos performativos tradicionais. "
            id_question = dbInsert(history[-1]["user"],resp)     
            return {"data_points": ["","",""] , "answer": resp, "thoughts": "","questionid":id_question}
        elif history[-1]["user"] == "O que é o Lhaço?":
            resp ="O Lhaço é o nome dado a cada uma das danças dos Pauliteiros, uma vez que, coreograficamente, os dançadores efetuam laços entre si. Cada um dos lhaços é composto por vários “movimentos coreográficos” diferentes: Abierta, braga, (quatrada), corrida, desbuolta, passaige e a bitcha, sendo o bater dos paus, simples ou picado."
            id_question = dbInsert(history[-1]["user"],resp)     
            return {"data_points": ["","",""] , "answer": resp, "thoughts": "","questionid":id_question}
        elif history[-1]["user"] == "Diz-me o que sabes sobre Miranda do Douro":
            resp ="Miranda do Douro é uma cidade portuguesa situada no distrito de Bragança, na região de Trás-os-Montes. É conhecida pela sua rica cultura, tradições e património, como por exemplo a Catedral de Miranda do Douro e o Castelo de Miranda do Douro. A cidade é também famosa pela sua linguagem própria, o mirandês, que é a segunda língua oficial de Portugal. Além disso, Miranda do Douro é o lar de vários grupos de dança tradicional, incluindo os Pauliteiros de Miranda, que realizam a Dança dos Pauliteiros, uma dança folclórica característica da região. Os principais grupos de Pauliteiros de Miranda são Palaçoulo, Cidade de Miranda, Sendim, Duas Igrejas, Malhadas, Fonte Aldeia, São Martinho, Mirandanças, Constantim, Prado Gatão e Póvoa."
            id_question = dbInsert(history[-1]["user"],resp)     
            return {"data_points": ["","",""] , "answer": resp, "thoughts": "","questionid":id_question}
        elif history[-1]["user"] == "Quais são os principais grupos de Pauliteiros de Miranda?":
            resp ="Os principais grupos de Pauliteiros de Miranda são Palaçoulo, Cidade de Miranda, Sendim, Duas Igrejas, Malhadas, Fonte Aldeia, São Martinho, Mirandanças, Constantim, Prado Gatão and Póvoa."
            id_question = dbInsert(history[-1]["user"],resp)     
            return {"data_points": ["","",""] , "answer": resp, "thoughts": "","questionid":id_question}       
        else:

        # STEP 1: Generate an optimized keyword search query based on the chat history and the last question
         prompt = self.query_prompt_template.format(chat_history=self.get_chat_history_as_text(history, include_last_turn=False), question=history[-1]["user"])
         completion = openai.Completion.create(
             engine=self.gpt_deployment, 
             prompt=prompt, 
             temperature=0.0, 
             max_tokens=32, 
             n=1, 
             stop=["\n"])
         q = completion.choices[0].text
    
         # STEP 2: Retrieve relevant documents from the search index with the GPT optimized query
         if overrides.get("semantic_ranker"):
             r = self.search_client.search(q, 
                                           filter=filter,
                                           query_type=QueryType.SEMANTIC, 
                                           query_language="en-us", 
                                           query_speller="lexicon", 
                                           semantic_configuration_name="default", 
                                           top=top, 
                                           query_caption="extractive|highlight-false" if use_semantic_captions else None)
         else:
             r = self.search_client.search(q, filter=filter, top=top)
         if use_semantic_captions:
             results = [doc[self.sourcepage_field] + ": " + nonewlines(" . ".join([c.text for c in doc['@search.captions']])) for doc in r]
         else:
             results = [doc[self.sourcepage_field] + ": " + nonewlines(doc[self.content_field]) for doc in r]
         content = "\n".join(results)
    
         follow_up_questions_prompt = self.follow_up_questions_prompt_content if overrides.get("suggest_followup_questions") else ""
         
         # Allow client to replace the entire prompt, or to inject into the exiting prompt using >>>
         prompt_override = overrides.get("prompt_template")
         if prompt_override is None:
             prompt = self.prompt_prefix.format(injected_prompt="", sources=content, chat_history=self.get_chat_history_as_text(history), follow_up_questions_prompt=follow_up_questions_prompt)
         elif prompt_override.startswith(">>>"):
             prompt = self.prompt_prefix.format(injected_prompt=prompt_override[3:] + "\n", sources=content, chat_history=self.get_chat_history_as_text(history), follow_up_questions_prompt=follow_up_questions_prompt)
         else:
             prompt = prompt_override.format(sources=content, chat_history=self.get_chat_history_as_text(history), follow_up_questions_prompt=follow_up_questions_prompt)
    
         # STEP 3: Generate a contextual and content specific answer using the search results and chat history
         completion = openai.Completion.create(
             engine=self.chatgpt_deployment, 
             prompt=prompt, 
             temperature=overrides.get("temperature") or 0.7, 
             max_tokens=1024, 
             n=1, 
             stop=["<|im_end|>", "<|im_start|>"])
         #id_question = dbInsert(history[-1]["user"], completion.choices[0].text)  
         id_question =1   
        return {"data_points": results, "answer": completion.choices[0].text, "thoughts": f"Searched for:<br>{q}<br><br>Prompt:<br>" + prompt.replace('\n', '<br>'),"questionid":id_question}
    
    def get_chat_history_as_text(self, history, include_last_turn=True, approx_max_tokens=1000) -> str:
        history_text = ""
        for h in reversed(history if include_last_turn else history[:-1]):
            history_text = """<|im_start|>user""" +"\n" + h["user"] + "\n" + """<|im_end|>""" + "\n" + """<|im_start|>assistant""" + "\n" + (h.get("bot") + """<|im_end|>""" if h.get("bot") else "") + "\n" + history_text
            if len(history_text) > approx_max_tokens*4:
                break    
        return history_text