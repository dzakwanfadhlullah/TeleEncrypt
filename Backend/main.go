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
	r.GET("/users", controller.GetAllUsers)
	r.POST("/users/email", controller.GetUserbyEmail)
	r.POST("/auth/register", controller.Registrasi)
	r.POST("/auth/login", controller.Login)
	r.Run("localhost:5000")
}