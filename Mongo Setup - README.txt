Instructions for setting up Local Database (MongoDB)

1.) Download and run the installer for Mongo from here: https://www.mongodb.com/try/download/community
2.) Find where it was installed (either on C drive root, or C:\Program Files\MongoDB\Server\)
3.) Navigate to the /bin folder and run mongod.exe.  
Note* a terminal window should open and STAY opened. If it closes immedietely, you need to create two folders on the C drive root "data/db" (data with a sub folder db)
    * This is where data will be saved. you can change it in the Mongo Shell after if you want

4.) Once mongod is running in the terminal, leave it open.  Mongo DB will not work if the Mongod is not running.
5.) Open a new Terminal and type "mongo --version"
Note* If "mongo" is not recognized, you need to add an env variable.  On Windows, type "env" in the search. Select "Path"-> Edit -> New
    * On an empty line paste the path to the /bin folder.  Mine for example was C:\Program Files\MongoDB\Server\5.0\bin 
    * Try mongo --version again.  it should work.

6.) Now type mongo to run the Mongo Shell (this is a direct access to your local DB via the command line.  
    ***Remember, mongod needs to be running. You can type mongod to run it if not already running

7.) In the terminal running mongo, run the following to generate a test Database

	use myDatabase

	
8.) The above will have generated a database with name "myDatabase".  You can confirm by typing "show databases"


Helpful Tips for Mongo/Mongoose:


-The url to access this database via Node.js is this:   'mongodb://127.0.0.1:27017/myDatabase' 
 
-You can use db.createCollection("testcollections") and other commands in the Mongo Shell to add/view/modify/delete data in the database directly
More documentation can be found here on what you can do: https://docs.mongodb.com/manual/reference/mongo-shell/

-You SHOULD NOT use camelcase in collection names when using mongoose Models and Schemas. USE ONE WORD if possible. Mongoose does not handle this well.

   For example:   db.createCollection("testCollections") would create a collection named "testCollection", 
                  but mongoose will try to find a collection named "testcollection" or "testcollections", 
                  and it will not exist.

-In Node.js, you only need to call the mongoose.Connect method once successfully before adding/querying documents, the 'mongoose' variable will remember if it is connected or not.


-Like Firebase, if a collection does not exist for the Model you made, Mongoose will create that collection before adding a document to it.

-Here are some queries that can be made off of a Mongoose Model object.

// Model.deleteMany()
// Model.deleteOne()
// Model.find()
// Model.findById()
// Model.findByIdAndDelete()
// Model.findByIdAndRemove()
// Model.findByIdAndUpdate()
// Model.findOne()
// Model.findOneAndDelete()
// Model.findOneAndRemove()
// Model.findOneAndReplace()
// Model.findOneAndUpdate()
// Model.replaceOne()
// Model.updateMany()
// Model.updateOne()

More Mongoose documentation can be found here: https://mongoosejs.com/docs/

 

