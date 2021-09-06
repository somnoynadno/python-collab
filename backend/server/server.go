package server

import (
	log "github.com/sirupsen/logrus"
	"net/http"
)

func RunForever() {
	r := initRouter()
	log.Info("listening on 0.0.0.0:8000")

	err := http.ListenAndServe(":8000", r)
	if err != nil {
		log.Fatal("failed to start server: ", err)
	}
}
