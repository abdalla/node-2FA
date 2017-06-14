import Koa from 'koa';
import QRCode from 'qrcode';
import speakeasy from 'speakeasy';
import Jade from 'koa-jade';

const app = new Koa();
const jade = new Jade();

jade.use(app);

const config = {
	length: 20,
};

let imageData = '-';
const getQRCode = async () => {
	const secret = speakeasy.generateSecret(config);

	return QRCode.toDataURL(secret.otpauth_url, (err, imgData) => {
		imageData = imgData;
	});
};

getQRCode();

app.use(async (ctx) => {
	ctx.render('img(src="#{imageData}")', { imageData }, { fromString: true });
});

app.listen(3000);
