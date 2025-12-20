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
		api.GET("/users", controller.GetAllUsers)
		api.POST("/users/email", controller.GetUserbyEmail)

		api.GET("/files", controller.GetUserFiles)
		api.PUT("/upload", controller.UploadFile)
		api.GET("/download/:id", controller.DownloadFile)
		api.DELETE("/files/delete/:id", controller.DeleteFile)

	}
	
	r.Run("localhost:5000")
}