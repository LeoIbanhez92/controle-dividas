import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);

    private get baseUrl(): string {
        return process.env.EVOLUTION_API_URL ?? '';
    }

    private get apiKey(): string {
        return process.env.EVOLUTION_API_KEY ?? '';
    }

    private get instance(): string {
        return process.env.EVOLUTION_INSTANCE ?? '';
    }

    async enviarCodigo(whatsapp: string, codigo: string): Promise<void> {
        if (!this.baseUrl || !this.apiKey || !this.instance) {
            this.logger.warn(
                'Variáveis de ambiente da Evolution API não configuradas. Código de recuperação: ' + codigo,
            );
            return;
        }

        const numeroCompleto = whatsapp.startsWith('55') ? whatsapp : `55${whatsapp}`;
        const url = `${this.baseUrl}/message/sendText/${this.instance}`;
        const mensagem =
            `🔐 *Recuperação de Senha*\n\n` +
            `Seu código de recuperação é: *${codigo}*\n\n` +
            `Este código expira em *15 minutos*.\n` +
            `Se não foi você, ignore esta mensagem.`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: this.apiKey,
            },
            body: JSON.stringify({
                number: numeroCompleto,
                text: mensagem,
            }),
        });

        if (!response.ok) {
            const body = await response.text();
            this.logger.error(`Erro ao enviar mensagem WhatsApp: ${response.status} - ${body}`);
            throw new InternalServerErrorException('Falha ao enviar código via WhatsApp');
        }
    }
}
