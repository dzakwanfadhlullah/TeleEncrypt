package controller

import (
	"Backend/model"
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
)

type LoginPayload struct {
    Email string `json:"email"`
    Password string `json:"password"`
}

type RegisterPayload struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Email struct {
	Email string `json:"email"`
}

func GetAllUsers(c *gin.Context) {
    users, err := model.GetAllUsers()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
	log.Println(users)
    c.JSON(200, users)
}

func GetUserbyEmail(c *gin.Context) {
	var input Email
	c.BindJSON(&input)

	user, err := model.FindUserbyEmail(input.Email)
	if err != nil {
		c.JSON(404, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"message": "success",
        "user":    user})
}

func GetUserByID(c *gin.Context) {
	// Implementasi pengambilan user berdasarkan ID
}

