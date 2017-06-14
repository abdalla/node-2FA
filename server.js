import Koa from 'koa';
import QRCode from 'qrcode';
import speakeasy from 'speakeasy';
import Jade from 'koa-jade';
import Router from 'koa-better-router';

const router = Router().loadMethods();

const app = new Koa();
const jade = new Jade();

jade.use(app);

const config = {
	length: 20,
};

let imageData = '-';
const getQRCode = async () => {
	const secret = {
		ascii: '<}w,{9A7a%C]wSZ.oR1.',
		hex: '3c7d772c7b3941376125435d77535a2e6f52312e',
		base32: 'HR6XOLD3HFATOYJFINOXOU22FZXVEMJO',
		otpauth_url: 'otpauth://totp/SecretKey?secret=HR6XOLD3HFATOYJFINOXOU22FZXVEMJO',
	};// speakeasy.generateSecret(config);

	return QRCode.toDataURL(secret.otpauth_url, (err, imgData) => {
		imageData = imgData;
	});
};

getQRCode();

app.on('error', (err, ctx) =>
	console.error('server error', err, ctx),
);

router.get('/valid/:token', async (ctx, next) => {
	const userToken = ctx.params.token;
	const secret = {
		ascii: '<}w,{9A7a%C]wSZ.oR1.',
		hex: '3c7d772c7b3941376125435d77535a2e6f52312e',
		base32: 'HR6XOLD3HFATOYJFINOXOU22FZXVEMJO',
		otpauth_url: 'otpauth://totp/SecretKey?secret=HR6XOLD3HFATOYJFINOXOU22FZXVEMJO',
	};

	const verified = speakeasy.totp.verify({
		secret: secret.base32,
		encoding: 'base32',
		token: userToken,
	});

	ctx.body = `token: ${verified}!`;

	return next();
});

// app.use(async (ctx) => {
// 	ctx.render('img(src="#{imageData}")', { imageData }, { fromString: true });
// });

app.use(router.middleware());
app.listen(3000);
