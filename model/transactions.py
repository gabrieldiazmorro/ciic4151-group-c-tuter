import os
import psycopg2

class TransactionsDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host=%s" % (
            os.getenv('DB_NAME'),
            os.getenv('DB_USER'),
            os.getenv('DB_PASSWORD'),
            os.getenv('DB_PORT'),
            os.getenv('DB_HOST'),
        )
        print("connection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllTransactions(self):
        cursor = self.conn.cursor()
        query = "select transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id " \
                "from public.transactions;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getTransactionByTransactionId(self, transaction_id):
        cursor = self.conn.cursor()
        query = "select transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id " \
                "from public.transactions where transaction_id = %s;"
        cursor.execute(query, (transaction_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def insertTransaction(self, ref_num, amount, user_id, payment_method, recipient_id):
        cursor = self.conn.cursor()
        query = "insert into public.transactions(ref_num, amount, transaction_date, user_id, payment_method, " \
                "recipient_id) values(%s,%s,now(),%s,%s,%s) returning transaction_id;"
        cursor.execute(query, (ref_num, amount, user_id, payment_method, recipient_id))
        uid = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return uid

    def updateTransaction(self, transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id):
        cursor = self.conn.cursor()
        query = "update public.transactions set ref_num = %s, amount = %s, transaction_date = %s, user_id = %s, " \
                "payment_method = %s, recipient_id = %s where transaction_id = %s;"
        cursor.execute(query, (ref_num, amount, transaction_date, user_id, payment_method, recipient_id, transaction_id))
        self.conn.commit()
        cursor.close()
        return True

    def deleteTransaction(self, transaction_id):
        cursor = self.conn.cursor()
        query = "delete from public.transactions where transaction_id=%s;"
        cursor.execute(query, (transaction_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the transaction was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def getTransactionsByUserId(self, user_id):
        cursor = self.conn.cursor()
        query = "select transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id " \
                "from public.transactions where user_id = %s;"
        cursor.execute(query, (user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def __del__(self):
        self.conn.close()
