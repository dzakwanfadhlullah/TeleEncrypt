package main
import (
	"github.com/gin-gonic/gin"
	"Backend/controller"
	"Backend/database"
	"Backend/middleware"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
)


func main() {
	godotenv.Load()
	database.ConnectDB()
	r := gin.Default()

	config := cors.DefaultConfig()
       config.AllowOrigins = []string{"http://localhost:3000"} // Masukkan domain frontend
       config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
       config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	   config.AllowCredentials = true

	r.Use(cors.New(config))

	auth := r.Group("/auth")
	{
		auth.POST("/register", controller.Registrasi)
		auth.POST("/login", controller.Login)
	}

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
	r.GET("/users", controller.GetAllUsers)
	r.POST("/users/email", controller.GetUserbyEmail)
	}
	
	r.Run("localhost:5000")
}