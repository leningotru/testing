import ReactDOM from "react-dom";
import React, { Component } from "react";
import { w3cwebsocket as websocketClient } from "websocket";
import { Card, Avatar, Input, Typography, Tooltip } from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "./index.css";
//creo el cliente
const connClient = new websocketClient("ws://127.0.0.1:5555");
//variables para los estilos propias de la libreria antd
const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;
export default class App extends Component {
  //manejamos las variables en nuestra peque;a aplicacion
  state = {
    user: "",
    login: false,
    messages: [],
  };
  componentDidMount() {
    //coneccion con el servidor
    connClient.onopen = () => {
      console.log("conectado");
    };
    //metodo que responde el servidor cuando un cliente hizo una peticion
    connClient.onmessage = (message) => {
      const dataServer = JSON.parse(message.data);
      console.log("server says" + JSON.stringify(dataServer));
      if (dataServer.type === "message") {
        //a;adimos al state todos los mensajes
        this.setState((state) => ({
          messages: [
            //copiamos todos los mensajes del state
            ...state.messages,
            {
              value: dataServer.value,
              user: dataServer.user,
            },
          ],
        }));
      }
    };
  }
  //metodo que captura texto y envia al servidor
  sendMessage = (value) => {
    connClient.send(
      JSON.stringify({
        type: "message",
        value: value,
        user: this.state.user,
      })
    );
    this.setState({ valueMessageToSend: "" });
  };
  //metodo que simula la entrada de la sala de un cliente
  entryRoom = (value) => {
    if (value == "") {
      this.setState({ login: false });
    } else this.setState({ login: true, user: value });
  };

  render() {
    return (
      <div className="main">
        {this.state.login ? ( // si ya se logueo el usuario mostramos el componente chat
          <div>
            <div className="titleChat">
              <Text style={{ fontSize: "36px", color: "white" }}>
                Chatea con Nosotros
              </Text>
              <br />
              <Text style={{ fontSize: "16px", color: "white" }}>
                #NoTeDetengas
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: 50,
              }}
            >
              {this.state.messages.map((message) => (
                <Card
                  key={message.user + message.value}
                  style={{
                    width: 300,
                    margin: "16px 4px 0 4px",
                    alignSelf:
                      this.state.user === message.user
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Meta
                    avatar={
                      <Avatar
                        style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                      >
                        {message.user[0].toUpperCase()}
                      </Avatar>
                    }
                    title={message.user}
                    description={message.value}
                  />
                </Card>
              ))}
            </div>
            <div className="inputMessage">
              <Search
                placeholder="Escribe tu mensaje ...."
                enterButton="Enviar"
                value={this.state.valueMessageToSend}
                size="large"
                onChange={(e) =>
                  this.setState({ valueMessageToSend: e.target.value })
                }
                onSearch={(value) => this.sendMessage(value)}
              />
            </div>
          </div>
        ) : (
          //si no se logue mostramos el componente de login
          <div className="login">
            <img
              //style={styles.componenteImg}
              src="https://www.handytec.mobi/images/logos/handytec_logo_index.svg"
              //style={styles.componenteImg}
            />
            <Search
              style={styles.componenteLogin}
              size="large"
              placeholder="Hola, por favor ingresa tu nombre"
              prefix={<UserOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title="Es para nosotros importante saber tu nombre para en el caso de que se pierda la comunicacion poder comunicarnos contigo">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
              enterButton="Chatea con un Handytech"
              onSearch={(value) => this.entryRoom(value)}
            />
          </div>
        )}
      </div>
    );
  }
}
const styles = {
  componenteLogin: { padding: "5% 10%" },
  componenteImg: { padding: "5% 10% 0%" },
};
ReactDOM.render(<App />, document.getElementById("root"));
