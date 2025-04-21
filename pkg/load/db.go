//loader pipeline 
package load

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	
	_ "github.com/go-sql-driver/mysql" // MySQL driver
	"github.com/go-redis/redis/v8"     // Redis driver
	_ "github.com/lib/pq"              // PostgreSQL driver
	_ "github.com/mattn/go-sqlite3"    // SQLite driver
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)
// LoadToPostgres loads data into a PostgreSQL database	
func LoadToPostgres(data []string, dbURL string) error {
	// Connect to the database
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}
	defer db.Close()

	// Create a table if it doesn't exist
	createTableQuery := `CREATE TABLE IF NOT EXISTS documents (
		id SERIAL PRIMARY KEY,
		content TEXT NOT NULL
	)`
	if _, err := db.Exec(createTableQuery); err != nil {
		return fmt.Errorf("failed to create table: %v", err)
	}

	// Insert data into the table
	for _, chunk := range data {
		insertQuery := `INSERT INTO documents (content) VALUES ($1)`
		if _, err := db.Exec(insertQuery, chunk); err != nil {
			return fmt.Errorf("failed to insert data: %v", err)
		}
	}

	return nil
}
// LoadToCSV loads data into a CSV file

func LoadToCSV(data []string, outputPath string) error {
	file, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create CSV file: %v", err)
	}
	defer file.Close()

	for _, chunk := range data {
		_, err := file.WriteString(chunk + "\n")
		if err != nil {
			return fmt.Errorf("failed to write to CSV file: %v", err)
		}
	}

	return nil
}
// LoadToJSONL loads data into a JSONL file
func LoadToJSONL(data []string, outputPath string) error {
	file, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create JSONL file: %v", err)
	}
	defer file.Close()

	for _, chunk := range data {
		_, err := file.WriteString(chunk + "\n")
		if err != nil {
			return fmt.Errorf("failed to write to JSONL file: %v", err)
		}
	}

	return nil
}
// LoadToSQLite loads data into a SQLite database
func LoadToSQLite(data []string, dbPath string) error {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return fmt.Errorf("failed to connect to SQLite database: %v", err)
	}
	defer db.Close()

	// Create a table if it doesn't exist
	createTableQuery := `CREATE TABLE IF NOT EXISTS documents (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		content TEXT NOT NULL
	)`
	if _, err := db.Exec(createTableQuery); err != nil {
		return fmt.Errorf("failed to create table: %v", err)
	}

	// Insert data into the table
	for _, chunk := range data {
		insertQuery := `INSERT INTO documents (content) VALUES (?)`
		if _, err := db.Exec(insertQuery, chunk); err != nil {
			return fmt.Errorf("failed to insert data: %v", err)
		}
	}

	return nil
}
// LoadToMySQL loads data into a MySQL database	
// LoadToMySQL writes the provided data to a MySQL database.
// The function connects to the MySQL database using the provided dbURL connection string,
// creates a 'documents' table if it doesn't exist, and then inserts each string in the data slice
// as a new row in the 'documents' table.
//
// Parameters:
//   - data: A slice of strings, each string will be inserted as content in a separate row.
//   - dbURL: MySQL connection string in the format "username:password@protocol(address)/dbname".
//
// Returns:
//   - error: An error if any step fails (connection, table creation, data insertion),
//     or nil if the operation is successful.
//
// Note: This function requires the MySQL driver to be imported as "mysql".
func LoadToMySQL(data []string, dbURL string) error {
	// Connect to the database
	db, err := sql.Open("mysql", dbURL)
	if err != nil {
		return fmt.Errorf("failed to connect to MySQL database: %v", err)
	}
	defer db.Close()

	// Create a table if it doesn't exist
	createTableQuery := `CREATE TABLE IF NOT EXISTS documents (
		id INT AUTO_INCREMENT PRIMARY KEY,
		content TEXT NOT NULL
	)`
	if _, err := db.Exec(createTableQuery); err != nil {
		return fmt.Errorf("failed to create table: %v", err)
	}

	// Insert data into the table
	for _, chunk := range data {
		insertQuery := `INSERT INTO documents (content) VALUES (?)`
		if _, err := db.Exec(insertQuery, chunk); err != nil {
			return fmt.Errorf("failed to insert data: %v", err)
		}
	}

	return nil
}
// LoadToMongoDB loads data into a MongoDB database
func LoadToMongoDB(data []string, dbURL string) error {
	// Connect to the MongoDB database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(dbURL))
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(context.TODO())

	collection := client.Database("mydb").Collection("documents")

	for _, chunk := range data {
		document := bson.M{"content": chunk}
		_, err := collection.InsertOne(context.TODO(), document)
		if err != nil {
			return fmt.Errorf("failed to insert data into MongoDB: %v", err)
		}
	}

	return nil
}
// LoadToRedis loads data into a Redis database	
func LoadToRedis(data []string, redisURL string) error {
	// Connect to the Redis database
	client := redis.NewClient(&redis.Options{
		Addr: redisURL,
	})
	defer client.Close()

	for i, chunk := range data {
		err := client.Set(context.TODO(), fmt.Sprintf("document:%d", i), chunk, 0).Err()
		if err != nil {
			return fmt.Errorf("failed to insert data into Redis: %v", err)
		}
	}

	return nil
}