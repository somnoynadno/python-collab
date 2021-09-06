package server

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"net/http"
)

// Hub maintains the set of active clients and
// broadcasts messages to the clients.
type Hub struct {
	classID    string
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

func NewHub(classID string) *Hub {
	return &Hub{
		classID:    classID,
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) log(log func(args ...interface{}), message string) {
	log(fmt.Sprintf("[HUB %s] %s", h.classID, message))
}

func (h *Hub) HandleConnection(r *http.Request, w http.ResponseWriter) {
	log.Debug("[WS] opening connection...")
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error("upgrade:", err)
		return
	}

	client := &Client{hub: h, conn: conn, send: make(chan []byte, 2048)}
	client.hub.register <- client

	go client.readPump()
	go client.writePump()
}

func (h *Hub) SendMessage(message []byte) {
	h.log(log.Debug, "broadcast: " + string(message))
	h.broadcast <- message
}

func (h *Hub) RunForever() {
	h.log(log.Info, "starting...")

	for {
		select {
		case client := <-h.register:
			h.log(log.Debug, "register new client")
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				h.log(log.Debug, "unregister client")
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
