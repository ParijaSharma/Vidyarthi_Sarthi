from pymongo import MongoClient

# Put wtv your connection string is here
client = MongoClient("mongodb://localhost:27017/")

# Replace 'scholar_db' with your actual database name, bro
db = client["vidyarthi_sarthi"]