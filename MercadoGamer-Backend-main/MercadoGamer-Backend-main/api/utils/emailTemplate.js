export const twoFactorHtml = (key) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap" rel="stylesheet">
  <title>Mercado</title>
</head>

<body>
  <div class="main-content"
    style="font-family:'Montserrat', sans-serif; background: #1A1A1A; grid-template-rows: min-content 1fr min-content; margin: 0; padding: 30px 12px; color: white;">
    <header>
      <div class="image-container" style="background: center/contain no-repeat url('https://www.mercadogamer.com/assets/imgs/MG-logo.png');
      margin: 0 auto;
      width: 215px;
      height: 104px;"></div>
    </header>
    <div class="content" style="margin-top: 40px !important; background: #16171D;">
      <div class="title" style="font-size: 30px;
      font-weight: 500;
      color:white;
      text-align: center;
      font-family:'Montserrat', sans-serif;">Verificación en 2 pasos</div>
      <div class="description" style="font-size: 16px;
      margin-top: 32px;
      line-height: 19.5px;">
        <div class="description-content" 
        style="text-align: center;
        color: #F5F2EB99;
        font-family:'Montserrat', sans-serif;">Este es tu código de verificación, en caso de que no
          lo hayas solicitado te recomedamos cambiar tu contraseña.</div>
        <div class="description-warning"
        style="text-align: center;
        color: #B50303;
        font-family:'Montserrat', sans-serif;">¡No compartas este código! Un soporte de
          Mercado Gamer nunca te solicitará tus datos.</div>
      </div>
      <div class="two-factor" style="font-size: 30px;
      font-weight: 700;
      text-align: center;
      margin-top: 24px;
      color: #F78A0E;
      font-family:'Montserrat', sans-serif;">${key}</div>
    </div>
    <footer style=" display: grid;
    margin-top: 63px;
    font-size: 12px;">
      <div class="label" style="text-align: center;
      color: #F5F2EB99;
      font-family:'Montserrat', sans-serif;">Jugar nunca fue tan accesible.</div>
      <div class="line" style="height: 1px;
      display: block;
      margin: 5px 0px;
      background-color: #202020;"></div>
      <div class="address" style="text-align: center;
      color: #F78A0E;
      font-family:'Montserrat', sans-serif;">Mercado Gamer</div>
    </footer>
  </div>
</body>

</html>`;

export const notificationEmailTemplate = (title, content, router, action) => `
<!DOCTYPE html>

<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap" rel="stylesheet">
  <title>Mercado</title>
</head>

<body>
  <div class="main-content"
    style="font-family:'Montserrat', sans-serif; background: #1A1A1A; grid-template-rows: min-content 1fr min-content; margin: 0; padding: 30px 12px; color: white;">
    <header>
      <div class="image-container" style="background: center/contain no-repeat url('https://www.mercadogamer.com/assets/imgs/MG-logo.png');
      margin: 0 auto;
      width: 215px;
      height: 104px;"></div>
    </header>
    <div class="content" style="margin-top: 40px !important;
	  background: #16171D;
    width: 450px;
    margin: auto;
    padding: 56px 30px;
    border-top:solid 4px #F78A0E;">
      <div class="title" style="font-size: 30px;
      font-weight: 500;
      color:white;
      text-align: center;
      font-family:'Montserrat', sans-serif;">${title}</div>
      <div class="description" style="font-size: 16px;
      margin-top: 32px;
      line-height: 19.5px;">
        <div class="description-content" style="text-align: center;
        color: #F5F2EB99;
        font-family:'Montserrat', sans-serif;">${content}</div>
      </div>
      <div class="title" style="font-size: 30px;
        font-weight: 500;
        color:white;
        text-align:center;
        margin-top:20px;
        font-family:'Montserrat', sans-serif;">
        <a href='https://www.mercadogamer.com/${router}' 
        style="background: #F78A0E;
        border-radius:25px;
        font-size:14px;
        padding: 14px 40px;
        color:#111217;
        font-family:'Montserrat', sans-serif;
        font-style:normal;
        font-weight:600;
        text-decoration:none" 
        target='_blank'>${action}</a>
      </div>
      <div style="margin-top: 40px;
        text-align: center;
        color: #F5F2EB99;
        font-family:'Montserrat', sans-serif;">¡Gracias por utilizar Mercado Gamer!</div>
    </div>
    <footer style=" display: grid;
    margin-top: 63px;
    font-size: 12px;">
      <div class="label" style="text-align: center;
      color: #F5F2EB99;
      font-family:'Montserrat', sans-serif;">Jugar nunca fue tan accesible.</div>
      <div class="line" style="height: 1px;
      display: block;
      margin: 5px 0px;
      background-color: #202020;"></div>
      <div class="address" style="text-align: center;
      color: #F78A0E;
      font-family:'Montserrat', sans-serif;">Mercado Gamer</div>
    </footer>
  </div>
</body>

</html>`;

export const recoveryPasswordEmailTemplate = (text) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap" rel="stylesheet">
  <title>Mercado</title>
</head>

<body>
  <div class="main-content"
    style="font-family:'Montserrat', sans-serif; background: #1A1A1A; grid-template-rows: min-content 1fr min-content; margin: 0; padding: 30px 12px; color: white;">
    <header>
      <div class="image-container" style="background: center/contain no-repeat url('https://www.mercadogamer.com/assets/imgs/MG-logo.png');
      margin: 0 auto;
      width: 215px;
      height: 104px;"></div>
    </header>
    <div class="content" style="
    margin-top: 40px !important;
	  background: #16171D;
	  width: 450px;
	  margin: auto;
	  padding: 56px 30px;
	  border-top:solid 4px #F78A0E;">
      <div class="title" style="font-size: 30px;
      font-weight: 500;
      color:white;
      text-align: center;
      font-family:'Montserrat', sans-serif;">Recupero de contraseña</div>
      <div class="description" style="font-size: 16px;
      margin-top: 32px;
      line-height: 19.5px;">
        <div class="description-content" style="text-align: center;
        color: #F5F2EB99;
        font-family:'Montserrat', sans-serif;">Restablecé tu contraseña haciendo clic en el enlace de abajo. <br>
		Este enlace de caducará 24 horas después de su envío.</div>
      </div>
      <div class="title" style="font-size: 30px;
      font-weight: 500;
      color:white;
      text-align:center;
      font-family:'Montserrat', sans-serif;
	    margin-top:20px;">${text}</div>
    </div>
    
    <footer style=" display: grid;
    margin-top: 63px;
    font-size: 12px;">
      <div class="label" style="text-align: center;
      color: #F5F2EB99;
      font-family:'Montserrat', sans-serif;">Recibiste este correo porque es importante para tu cuenta.<br>
Copyright © 2022 Mercado Gamer. Todos los derechos reservados.</div>
      <div class="line" style="height: 1px;
      display: block;
      margin: 5px 0px;
      background-color: #202020;"></div>
      <div class="address" style="text-align: center;
      color: #F78A0E;
      font-family:'Montserrat', sans-serif;">Mercado Gamer</div>
    </footer>
  </div>
</body>

</html>`;
