package server

import (
	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	log "github.com/sirupsen/logrus"
	"net/http"
	"python-collab/backend/server/middleware"
)

func initRouter() *mux.Router {
	hubs := map[string]*Hub{}

	r := mux.NewRouter()
	r.HandleFunc("/ws/{class_id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		classID, ok := vars["class_id"]
		if !ok {
			log.Warn("class id is missing in parameters")
			return
		}

		if h, found := hubs[classID]; found {
			h.HandleConnection(r, w)
		} else {
			h := NewHub(classID)
			hubs[classID] = h
			go h.RunForever()

			h.HandleConnection(r, w)
		}
	})

	r.Handle("/metrics", promhttp.Handler())

	r.Use(middleware.CORS)    // enable CORS headers
	r.Use(middleware.LogPath) // log IP, path and method

	return r
}

