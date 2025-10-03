<?php
include("conexao.php");

$nome  = $_POST['nome'];
$email = $_POST['email'];
$senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); // senha criptografada

$sql = "INSERT INTO usuarios (nome, email, senha) VALUES ('$nome', '$email', '$senha')";

if ($conn->query($sql) === TRUE) {
    echo "<script>alert('Cadastro realizado com sucesso!'); window.location.href='../login.html';</script>";
} else {
    echo "<script>alert('Erro ao cadastrar: " . $conn->error . "'); window.location.href='../cadastro.html';</script>";
}

$conn->close();
?>
