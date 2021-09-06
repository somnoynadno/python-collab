package main

import (
	log "github.com/sirupsen/logrus"
	"os"
	"python-collab/backend/server"
)

func init() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.DebugLevel)
}

func main() {
	server.RunForever()
}
