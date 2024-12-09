const messages = {
    new_user: (data) => {
        const { name, phone, email, tg_username, link } = data
        return `⚡ *Новая заявка на регистрацию агента/блогера!*
ФИО: ${name}
Контактный телефон: ${phone}
Электронная почта: ${email}
Telegram: @${tg_username}
Ссылка на блог/социальные сети: ${link}
Пожалуйста, проверьте данные и подтвердите регистрацию.
`
    },
    new_referal: (data) => {
        const { name, phone, tg_username, services, request, brand, model } = data
        return `📋 *Новый клиент зарегистрировался по реферальной ссылке!*
ФИО: ${name}
Контактный телефон: ${phone}
Telegram: ${tg_username}
Выбранные группы услуг: ${services}
Конкретный запрос: ${request}
Марка и модель автомобиля: ${brand} ${model}
Пожалуйста, свяжитесь с клиентом для уточнения деталей.
`
    },
    success_registration: () => {
        `✅ Успешная регистрация!
Ваш аккаунт подтвержден. Теперь вы можете создавать свои реферальные ссылки для привлечения клиентов. Перейдите в личный кабинет для создания ссылки.
`
    }
};

export { messages };