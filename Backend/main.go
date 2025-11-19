package main
import (
	"github.com/gin-gonic/gin"
	"Backend/controller"
	"Backend/database"
	"github.com/joho/godotenv"
)


func main() {
	godotenv.Load()
	database.ConnectDB()
	r := gin.Default()
	r.GET("/users", controller.GetUsers)
	r.Run(":5000")
}