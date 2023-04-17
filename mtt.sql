-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-04-2023 a las 23:56:41
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mtt`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id` int(11) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(15) DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(100) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `precio` decimal(10,2) UNSIGNED NOT NULL,
  `urlImagen` varchar(500) NOT NULL,
  `estado` varchar(15) DEFAULT 'activado',
  `disponibilidad` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `urlImagen`, `estado`, `disponibilidad`) VALUES
(25, 'Alex', 'bombastic', '2.00', '1681401022433-20230213_100649.jpg', 'activado', 2),
(26, 'mae', 'mae', '181122.00', '1681401544390-Captura de pantalla 2023-03-14 215700.png', 'activado', 181122),
(27, 'Yo hablando de futbol', 'Yo debajo del mantel', '616.00', '1681430252195-20230219_133927.jpg', 'activado', 69);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_ordenes`
--

CREATE TABLE `productos_ordenes` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `email` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `domicilio` varchar(60) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `tipo` enum('administrador','usuario') DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`email`, `name`, `password`, `domicilio`, `telefono`, `tipo`) VALUES
('alejandrolgamotta@hotmail.com', 'alex', '$2b$12$P/E2JRI44t/V7Q5go68RD.wI0cx/Bz8BvynV91/KYQBI6jFgsdDyu', 'Misiones', '6692511958', 'usuario'),
('amigo@nomanches.com', 'pepito', '$2b$12$KL5cE3RZ7dlIDB90MVJg3OnQoNRlppE1kbJt3CspRu4Lf69zUZd/y', '', '0', 'usuario'),
('hola@hola.hola', 'hola', '$2b$12$dItMb89e0hZ8Rsgw9DJpJO7A5VlhcCby9Hh/lhZlxfb7wKKY/8/yi', 'hola', '6692', 'usuario'),
('mae@gmail.com', 'Mae', '$2b$12$ZGNYa5o8yid3JSiu5cVl9O7pcWDqx8L.hH2DF3M7Z9XSJBCqw9C8i', '', '0', 'administrador'),
('marvin@god.com', 'marvin', '$2b$12$.a9TDJ8GpzZZk/Sutpof2ue5CSnav.UoTJu3QQhLyhK/0nBI1iPF.', 'marvin', '669555544', 'usuario'),
('rodrigo@goku.com', 'rodrigo', '$2b$12$tNuXPGsKz/4zJNFMRAccg.ch6QyWSaBMtpLfEKLqKmHhKQBoZFnae', '', '0', 'usuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos_ordenes`
--
ALTER TABLE `productos_ordenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_producto_id` (`producto_id`),
  ADD KEY `fk_orden_id` (`orden_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `productos_ordenes`
--
ALTER TABLE `productos_ordenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos_ordenes`
--
ALTER TABLE `productos_ordenes`
  ADD CONSTRAINT `fk_orden_id` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_producto_id` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
