-- tabla de compradores
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    password TEXT NOT NULL

)

;

-- tabla de vendedores
CREATE TABLE IF NOT EXISTS vendedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    password TEXT NOT NULL
)

;

-- servicios publicados 
CREATE TABLE IF NOT EXISTS servicios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    id_vendedor INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    
    descripcion TEXT,
    fecha_publicacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vendedor) REFERENCES vendedores(id)
);

-- ofertas aceptadas

CREATE TABLE IF NOT EXISTS ofertas (

    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_servicio INTEGER NOT NULL,

    id_comprador INTEGER NOT NULL,

    estado TEXT CHECK(estado IN ('aceptada', 'cancelada')) DEFAULT 'aceptada',
    fecha_oferta TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id),

    FOREIGN KEY (id_comprador) REFERENCES usuarios(id)
)

;

-- chat directo 
CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario1 INTEGER NOT NULL,

    id_usuario2 INTEGER NOT NULL,
    mensaje TEXT NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
)

;

-- calificaciones 
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    id_usuario INTEGER NOT NULL,
    calificacion INTEGER CHECK(calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP
)

;
