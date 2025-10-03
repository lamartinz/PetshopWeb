<?php
include("conexao.php");

$email = $_POST['email'];
$senha = $_POST['senha'];

$sql = "SELECT * FROM usuarios WHERE email='$email' LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();

    if (password_verify($senha, $usuario['senha'])) {
        session_start();
        $_SESSION['usuario'] = $usuario['nome'];
        echo "<script>alert('Login realizado com sucesso!'); window.location.href='../index.html';</script>";
    } else {
        echo "<script>alert('Senha incorreta!'); window.location.href='../login.html';</script>";
    }
} else {
    echo "<script>alert('Usuário não encontrado!'); window.location.href='../login.html';</script>";
}

$conn->close();
?>
