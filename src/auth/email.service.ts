import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    private get apiKey(): string {
        return process.env.RESEND_API_KEY ?? '';
    }

    private get frontendUrl(): string {
        return process.env.FRONTEND_URL ?? 'http://localhost:3000';
    }

    async enviarLinkRecuperacao(email: string, token: string): Promise<void> {
        this.logger.log(`[INÍCIO] Enviando link de recuperação para: ${email}`);

        if (!this.apiKey) {
            this.logger.error('Variável RESEND_API_KEY não configurada no .env');
            this.logger.warn(`[FALLBACK] Token gerado (não enviado): ${token}`);
            return;
        }

        const resend = new Resend(this.apiKey);
        const link = `${this.frontendUrl}/redefinir-senha?token=${token}`;

        try {
            const { error } = await resend.emails.send({
                from: 'Controle de Dívidas <onboarding@resend.dev>',
                to: email,
                subject: '🔐 Recuperação de Senha',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                        <h2>Recuperação de Senha</h2>
                        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
                        <p>Clique no botão abaixo para criar uma nova senha:</p>
                        <a href="${link}" style="
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #4F46E5;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                            margin: 16px 0;
                        ">Redefinir Senha</a>
                        <p style="color: #6B7280; font-size: 14px;">
                            Este link expira em <strong>15 minutos</strong>.<br/>
                            Se você não solicitou a recuperação, ignore este e-mail.
                        </p>
                        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;"/>
                        <p style="color: #9CA3AF; font-size: 12px;">
                            Ou copie e cole este link no navegador:<br/>
                            <a href="${link}" style="color: #4F46E5;">${link}</a>
                        </p>
                    </div>
                `,
            });

            if (error) {
                this.logger.error(`[ERRO API] ${JSON.stringify(error)}`);
                throw new InternalServerErrorException('Falha ao enviar e-mail de recuperação');
            }

            this.logger.log(`[SUCESSO] E-mail enviado para ${email}`);
        } catch (err) {
            this.logger.error(`[ERRO] Falha ao enviar e-mail: ${(err as Error).message}`);
            throw new InternalServerErrorException('Falha ao enviar e-mail de recuperação');
        }
    }
}
