import pandas as pd
import psycopg2 as pg
from sqlalchemy import create_engine

def dbInsert(questionId,feedback):
    
    connection = pg.connect(user = 'Admingpt', password = 'Sorocaba08041991', host = 'mirandadodouro.postgres.database.azure.com', port = '5432', database = 'mirandaDb')
    curs2 = connection.cursor()
    sql = "update public.questions set feedback='Funcionou02' where  questionid =  cast('"+questionId+"' AS INTEGER)"
    curs2.execute(sql)
    connection.commit()
    

class userfeedback():
   pass