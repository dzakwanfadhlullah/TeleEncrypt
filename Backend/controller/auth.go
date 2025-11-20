package controller

import (
	"Backend/model"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"github.com/google/uuid"
	"net/http"
)

func Registrasi(c *gin.Context) {
	var input RegisterPayload
	c.BindJSON(&input)

	hasilcek, err := model.CekEmailTerdaftar(input.Email)

	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Terjadi kesalahan pada server"})
        return
    }
    if hasilcek { 
         c.JSON(400, gin.H{"error": "Email sudah terdaftar"})
         return
    }
	
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal hash password"})
		return
	}
	newUser := model.Users{
		UserID:   uuid.New(),            // Generate UUID baru
		Username: input.Username,
		Email:    input.Email,
		Password: string(hashedPassword), // Masukkan hasil HASH, bukan payload.Password
	}

	 model.Registrasi(newUser)
	c.JSON(200, gin.H{"message": "Registrasi berhasil"})
}

