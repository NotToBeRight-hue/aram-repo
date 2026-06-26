import os
import logging
import mysql.connector
from mysql.connector import errorcode

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.config = {
            "user": os.environ.get("DB_USER", "root"),
            "password": os.environ.get("DB_PASSWORD", "sql@123"),
            "host": os.environ.get("DB_HOST", "127.0.0.1"),
            "database": os.environ.get("DB_NAME", "aram_db"),
            "raise_on_warnings": True,
        }
        self.connection = None
        logger.info(f"Database config initialized: user={self.config['user']}, host={self.config['host']}, database={self.config['database']}")

    def connect(self):
        if self.connection and self.connection.is_connected():
            logger.debug("Database connection already active.")
            return

        try:
            logger.info(f"Attempting MySQL connection to {self.config['host']}:{3306}, database={self.config['database']}")
            self.connection = mysql.connector.connect(**self.config)
            logger.info(f"Successfully connected to MySQL database '{self.config['database']}'")
        except mysql.connector.Error as err:
            error_msg = f"MySQL Error [{err.errno}]: {err.msg}"
            logger.error(error_msg)
            if err.errno == errorcode.ER_BAD_DB_ERROR:
                raise RuntimeError("Database does not exist. Run backend/db_schema.sql first.") from err
            raise RuntimeError(f"Unable to connect to MySQL: {error_msg}") from err
        except Exception as err:
            error_msg = f"Unexpected error during MySQL connection: {type(err).__name__}: {str(err)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg) from err

    def normalize_inventory_payload(self, data):
        return {
            "ShopName": data.get("ShopName") or data.get("shopName", ""),
            "District": data.get("District") or data.get("district", ""),
            "CurrentStock": int(data.get("CurrentStock") if data.get("CurrentStock") not in (None, "") else data.get("currentStock", 0)),
            "MonthlyDemand": int(data.get("MonthlyDemand") if data.get("MonthlyDemand") not in (None, "") else data.get("monthlyDemand", 0)),
            "Population": int(data.get("Population") if data.get("Population") not in (None, "") else data.get("population", 0)),
            "LastMonthConsumption": int(data.get("LastMonthConsumption") if data.get("LastMonthConsumption") not in (None, "") else data.get("lastMonthConsumption", 0)),
        }

    def fetch_inventory(self):
        self.connect()
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT ShopID, ShopName, District, CurrentStock, MonthlyDemand, Population, LastMonthConsumption, CreatedAt "
            "FROM inventory ORDER BY ShopID DESC"
        )
        rows = cursor.fetchall()
        cursor.close()
        return rows

    def insert_inventory(self, data):
        self.connect()
        clean_data = self.normalize_inventory_payload(data)
        query = (
            "INSERT INTO inventory (ShopName, District, CurrentStock, MonthlyDemand, Population, LastMonthConsumption) "
            "VALUES (%s, %s, %s, %s, %s, %s)"
        )
        values = (
            clean_data["ShopName"],
            clean_data["District"],
            clean_data["CurrentStock"],
            clean_data["MonthlyDemand"],
            clean_data["Population"],
            clean_data["LastMonthConsumption"],
        )
        cursor = self.connection.cursor()
        cursor.execute(query, values)
        self.connection.commit()
        shop_id = cursor.lastrowid
        cursor.close()
        return {
            "ShopID": shop_id,
            "ShopName": values[0],
            "District": values[1],
            "CurrentStock": values[2],
            "MonthlyDemand": values[3],
            "Population": values[4],
            "LastMonthConsumption": values[5],
        }

    def update_inventory(self, shop_id, data):
        self.connect()
        clean_data = self.normalize_inventory_payload(data)
        query = (
            "UPDATE inventory SET ShopName=%s, District=%s, CurrentStock=%s, MonthlyDemand=%s, Population=%s, LastMonthConsumption=%s "
            "WHERE ShopID=%s"
        )
        values = (
            clean_data["ShopName"],
            clean_data["District"],
            clean_data["CurrentStock"],
            clean_data["MonthlyDemand"],
            clean_data["Population"],
            clean_data["LastMonthConsumption"],
            shop_id,
        )
        cursor = self.connection.cursor()
        cursor.execute(query, values)
        self.connection.commit()
        cursor.close()
        return self.fetch_inventory()

    def delete_inventory(self, shop_id):
        self.connect()
        cursor = self.connection.cursor()
        cursor.execute("DELETE FROM inventory WHERE ShopID=%s", (shop_id,))
        self.connection.commit()
        cursor.close()

    def export_inventory_csv(self):
        self.connect()
        cursor = self.connection.cursor()
        cursor.execute(
            "SELECT ShopID, ShopName, District, CurrentStock, MonthlyDemand, Population, LastMonthConsumption, CreatedAt "
            "FROM inventory ORDER BY ShopID DESC"
        )
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        cursor.close()

        import csv
        import io

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(columns)
        writer.writerows(rows)
        return output.getvalue()
