const express = require("express");
const amqp = require("amqplib");

const app = express();
const PORT = 3000;

app.get("/users", async (req, res) => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("userQueue");
  for (let i = 0; i <= 5; i++) {
    // setTimeout(()=>{
    let msg = JSON.stringify({ i });
    await channel.sendToQueue("userQueue", Buffer.from(msg));
    // },2000)
  }
  // await channel.sendToQueue("userQueue", Buffer.from("test new queue"));

  setTimeout(() => {
    channel.consume(
      "userQueue",
      (msg) => {
        console.log("new msg: ");
        console.log(msg);
        console.log(msg.content.toString());
      },
      { noAck: true }
    );
  }, 3000);

  res.send("ok");
});

app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});
