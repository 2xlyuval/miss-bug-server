export default {
  dbURL:
    process.env.MONGO_URL ||
    "mongodb+srv://2xlyuval:ZLgydyLKSsFkG0tD@mycluster.ekgotgp.mongodb.net/?retryWrites=true&w=majority&appName=myCluster",
  dbName: process.env.DB_NAME || "bug_db",
}
