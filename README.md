# Roblox Tycoon (Scripts Only)

Этот репозиторий содержит только скрипты для базового tycoon с GUI магазином.

## Что внутри
- **ServerScriptService/TycoonServer.lua** — лидерстаты, пассивный доход и обработка покупок.  
- **StarterPlayerScripts/ShopGui.client.lua** — создание GUI магазина и вызов покупок.  

## Как использовать
1. Скопируй скрипты в соответствующие сервисы Roblox Studio:
   - `TycoonServer.lua` → **ServerScriptService**
   - `ShopGui.client.lua` → **StarterPlayerScripts**
2. В файле `TycoonServer.lua` укажи свои ID:
   - `GAMEPASS_DOUBLE_MONEY_ID`
   - `DEV_PRODUCT_MONEY_100K_ID`
   - `DEV_PRODUCT_MONEY_500K_ID`
3. Опубликуй Developer Products и GamePass в Roblox (Creator Dashboard).

## Магазин
- **2x Деньги** — 40 Robux (GamePass)
- **100,000 Денег** — 100 Robux (Developer Product)
- **500,000 Денег** — 250 Robux (Developer Product, можно поменять)
