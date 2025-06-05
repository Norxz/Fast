:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #f39c12;
    --light-color: #ecf0f1;
    --dark-color: #2c3e50;
    --text-color: #333;
    --text-light: #777;
    --white: #fff;
    --gray-light: #f5f5f5;
    --border-radius: 8px;
    --box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--text-color);
    line-height: 1.6;
}

.landing-container {
    max-width: 100%;
    overflow-x: hidden;
}

/* Comienzo */
.landing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 5%;
    background-color: var(--white);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.logo {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary-color);
}

.logo i {
    margin-right: 0.5rem;
    color: var(--accent-color);
}

.auth-links {
    display: flex;
    gap: 1rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    text-decoration: none;
    transition: var(--transition);
    border: 2px solid transparent;
    cursor: pointer;
    gap: 0.5rem;
}

.btn-login {
    background-color: transparent;
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-login:hover {
    background-color: var(--primary-color);
    color: var(--white);
}

.btn-primary {
    background-color: var(--secondary-color);
    color: var(--white);
    border-color: var(--white);
}

.btn-primary:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
}

.btn-outline {
    background-color: transparent;
    color: var(--white);
    border-color: var(--white);
} 

.btn-outline:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
}

.btn-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

/* Intro */
.hero-section {
    display: flex;
    align-items: center;
    min-height: 100vh;
    padding: 8% 5% 5%;
    background-color: var(--gray-light);
    margin-top: 80px;
}

.hero-content {
    flex: 1;
    padding-right: 2rem;
}

.hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
}

.hero-image img {
    max-width: 100%;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    animation: float 6s ease-in-out infinite;
}

h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    line-height: 1.2;
}

h1 span {
    color: var(--secondary-color);
}

.hero-subtitle {
    font-size: 1.2rem;
    color: var(--text-light);
    margin-bottom: 2.5rem;
    max-width: 600px;
}

.hero-cta {
    display: flex;
    gap: 1.5rem;
    margin-top: 2rem;
}

/* seccion 1 */
.features-section {
    padding: 6rem 5%;
    background-color: var(--white);
}

.features-section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 4rem;
    color: var(--primary-color);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2.5rem;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-card {
    background-color: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    text-align: center;
    transition: var(--transition);
}

.feature-card:hover {
    transform: translateY(-10px);
}

.feature-icon {
    width: 80px;
    height: 80px;
    background-color: rgba(52, 152, 219, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    color: var(--secondary-color);
    font-size: 2rem;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.feature-card p {
    color: var(--text-light);
}

/* como funciona */
.how-it-works {
    padding: 6rem 5%;
    background-color: var(--gray-light);
}

.how-it-works h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 4rem;
    color: var(--primary-color);
}

.steps-container {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.step-number {
    width: 60px;
    height: 60px;
    background-color: var(--secondary-color);
    color: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.step-content h3 {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
    color: var(--primary-color);
}

.step-content p {
    color: var(--text-light);
}

/* CTA Section */
.cta-section {
    padding: 6rem 5%;
    background-color: var(--secondary-color);
    color: var(--white);
    text-align: center;
}

.cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
}

.cta-section p {
    font-size: 1.2rem;
    margin-bottom: 3rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.landing-footer {
    background-color: var(--primary-color);
    color: var(--white);
    padding: 4rem 5% 2rem;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 3rem;
}

.footer-brand .logo {
    color: var(--white);
    margin-bottom: 1.5rem;
}

.footer-brand p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
}

.footer-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
}

.link-group h4 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: var(--white);
}

.link-group a {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
    text-decoration: none;
    transition: var(--transition);
}

.link-group a:hover {
    color: var(--accent-color);
}

.footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.footer-bottom p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}

.social-links {
    display: flex;
    gap: 1.5rem;
}

.social-links a {
    color: var(--white);
    font-size: 1.2rem;
    transition: var(--transition);
}

.social-links a:hover {
    color: var(--accent-color);
    transform: translateY(-3px);
}

/* aniamciones */
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
}


@media (max-width: 992px) {
    h1 {
        font-size: 2.8rem;
    }
    
    .hero-section {
        flex-direction: column;
        text-align: center;
        padding-top: 12rem;
    }
    
    .hero-content {
        padding-right: 0;
        margin-bottom: 3rem;
    }
    
    .hero-cta {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .landing-header {
        padding: 1rem 5%;
    }
    
    h1 {
        font-size: 2.2rem;
    }
    
    .hero-cta {
        flex-direction: column;
        gap: 1rem;
    }
    
    .btn-large {
        width: 100%;
    }
    
    .cta-buttons {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .cta-buttons .btn {
        width: 100%;
        max-width: 300px;
    }
}

@media (max-width: 576px) {
    .logo span {
        display: none;
    }
    
    .auth-links {
        gap: 0.5rem;
    }
    
    .btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    .steps-container {
        grid-template-columns: 1fr;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
    }
    
    .footer-bottom {
        flex-direction: column;
        text-align: center;
    }
} 
/* Estilos para la sección de contacto */
.contact-section {
    padding: 5rem 5%;
    background-color: #f9f9f9;
}

.contact-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
}

.contact-info h2, 
.contact-form h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.info-item {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.8rem;
    align-items: flex-start;
}

.info-item i {
    font-size: 1.5rem;
    color: var(--secondary-color);
    margin-top: 0.3rem;
}

.info-item h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--dark-color);
}

.info-item p {
    color: var(--text-light);
    line-height: 1.6;
}

.info-item a {
    color: var(--secondary-color);
    text-decoration: none;
    transition: var(--transition);
}

.info-item a:hover {
    color: var(--primary-color);
    text-decoration: underline;
}

.social-media {
    display: flex;
    gap: 1.2rem;
    margin-top: 2rem;
}

.social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--secondary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.social-icon:hover {
    background-color: var(--primary-color);
    transform: translateY(-3px);
}

.contact-form {
    background-color: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: var(--secondary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.form-group textarea {
    resize: vertical;
    min-height: 150px;
}

.map-container {
    max-width: 1200px;
    margin: 3rem auto 0;
    height: 400px;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--box-shadow);
}

.map-container iframe {
    width: 100%;
    height: 100%;
    border: none;
}

/* Estilos para mensajes de estado */
#formStatus {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: var(--border-radius);
    display: none;
}

#formStatus.success {
    background-color: #d4edda;
    color: #155724;
    display: block;
}

#formStatus.error {
    background-color: #f8d7da;
    color: #721c24;
    display: block;
}

@media (max-width: 768px) {
    .contact-container {
        grid-template-columns: 1fr;
    }
    
    .map-container {
        height: 300px;
    }
}
