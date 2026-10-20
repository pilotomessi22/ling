# Plano de Estratégia de Frete e Faturamento de Pedidos

Este plano estrutura a nova arquitetura do sistema de **Frete e Despacho de Pedidos** para a **Ling Petshop USA**, garantindo uma experiência minimalista, limpa e profissional no checkout do cliente e o gerenciamento estratégico interno no Painel Admin.

---

## Decisões Confirmadas do Lojista (Phase 1)

> [!IMPORTANT]
> As escolhas abaixo foram confirmadas pelo lojista para a estratégia de frete:

- **1. Nomes Limpos, Valores e Prazos no Checkout**:
  - **Standard Delivery (3–5 Days)**: **$4,95** (ou **FREE** para pedidos de $45,00+).
  - **Express Delivery (2–4 Days)**: **$9,95** (sempre cobrado).
- **2. Sigilo da Estratégia de Despacho (Segredo do Lojista)**:
  - **Visão do Cliente**: Nomes minimalistas e diretos sem termos pesados ("Standard Delivery" e "Express Delivery").
  - **Visão do Lojista (Painel Admin)**: Cada pedido recebido exibe uma **Etiqueta de Prioridade de Despacho**:
    - Pedidos **Express Delivery ($9,95)**: Destaque **"URGENTE: Confirmar com Fornecedor em até 2 horas"**.
    - Pedidos **Standard Delivery ($4,95 ou Free)**: Destaque **"PADRÃO: Confirmar com Fornecedor após 24 horas"** (Janela de segurança contra cancelamentos).

---

## 1. Visão Geral & Experiência do Cliente

### A. Fluxo de Seleção no Checkout (`CheckoutPage.tsx`)
- Ao chegar na etapa de frete do Checkout, o cliente vê apenas o essencial de forma limpa e minimalista:
  - **Standard Delivery (3 to 5 Days)**
    - Preço: **FREE** (se o pedido for de $45+) ou **$4.95**.
  - **Express Delivery (2 to 4 Days)**
    - Preço: **$9.95**.
- Sem textos longos ou burocráticos. Cálculo direto sem acumular nem somar taxas.

### B. Confirmação do Pedido (`CheckoutPage.tsx`)
- O comprovante do pedido exibe exatamente o método escolhido ("Standard Delivery - 3 to 5 Days" ou "Express Delivery - 2 to 4 Days").

---

## 2. Visão do Lojista no Painel Admin (`AdminPanel.tsx`)

Na aba **Pedidos & Vendas (Orders)** do Painel Admin:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Painel Admin - Pedidos                          │
├────────────────────────────────────────────────────────────────────────┤
│ Pedido #LP-US-892104                                                   │
│ Cliente: John Smith (Florida)                                          │
│ Frete: Express Delivery ($9.95 · 2 to 4 Days)                          │
│ 🚨 AÇÃO: URGENTE - Confirmar no Zendrop em até 2 horas!                 │
├────────────────────────────────────────────────────────────────────────┤
│ Pedido #LP-US-741902                                                   │
│ Cliente: Sarah Jenkins (Texas)                                         │
│ Frete: Standard Delivery ($4.95 / Free · 3 to 5 Days)                  │
│ ⏳ AÇÃO: PADRÃO - Aguardar 24h antes de confirmar no Zendrop            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Arquitetura Técnica & Lógica de Negócios

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Checkout System                               │
├───────────────────────────────────┬────────────────────────────────────┤
│ Standard Delivery ($4.95 / Free)  │      Express Delivery ($9.95)       │
│        (3 to 5 Days)              │            (2 to 4 Days)           │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Order Calculation Logic                         │
│   shippingCost = option === 'express' ? 9.95 : baseShipping            │
└───────────────────────────────────┬────────────────────────────────────┤
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Admin Order Management                            │
│   tag = option === 'express' ? '2h Urgent' : '24h Standard'            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Plano de Execução & Alterações nos Arquivos

1. **`src/utils/storeLogic.ts`**:
   - Definir `EXPRESS_SHIPPING_FEE = 9.95` e manter frete padrão ($4.95 ou $0 para $45+).
2. **`src/pages/CheckoutPage.tsx`**:
   - Simplificar as opções de frete para "Standard Delivery (3 to 5 Days)" e "Express Delivery (2 to 4 Days)".
   - Remover descrições burocráticas mantendo a interface ultra clean.
   - Salvar a tag de despacho correspondente no pedido (`express` -> 2h urgente; `standard` -> 24h padrão).
3. **`src/components/AdminPanel.tsx`**:
   - Exibir o alerta de despacho rápido (2h) vs normal (24h) na lista de pedidos.
4. **Verificação & Compilação**:
   - Executar `compile_applet` e `lint_applet` para validar que não há erros no build.
