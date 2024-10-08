function status(request, response) {
  response.status(200).json({ chave: "Você contactou o endpoint status" });
}

export default status;
