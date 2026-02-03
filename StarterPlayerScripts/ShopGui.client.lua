local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer

local GAMEPASS_DOUBLE_MONEY_ID = 123456789 -- 40 Robux (замени на свой)
local DEV_PRODUCT_MONEY_100K_ID = 234567890 -- 100 Robux (замени на свой)
local DEV_PRODUCT_MONEY_500K_ID = 345678901 -- 250 Robux (замени на свой)

local function createButton(parent, text, positionY, onClick)
	local button = Instance.new("TextButton")
	button.Size = UDim2.new(1, -20, 0, 50)
	button.Position = UDim2.new(0, 10, 0, positionY)
	button.BackgroundColor3 = Color3.fromRGB(35, 35, 35)
	button.TextColor3 = Color3.fromRGB(255, 255, 255)
	button.Font = Enum.Font.GothamBold
	button.TextSize = 18
	button.Text = text
	button.Parent = parent

	button.MouseButton1Click:Connect(onClick)
	return button
end

local function buildShopGui()
	local screenGui = Instance.new("ScreenGui")
	screenGui.Name = "TycoonShopGui"
	screenGui.ResetOnSpawn = false
	screenGui.Parent = player:WaitForChild("PlayerGui")

	local frame = Instance.new("Frame")
	frame.Size = UDim2.new(0, 300, 0, 240)
	frame.Position = UDim2.new(0, 20, 0.5, -120)
	frame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
	frame.BorderSizePixel = 0
	frame.Parent = screenGui

	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -20, 0, 40)
	title.Position = UDim2.new(0, 10, 0, 10)
	title.BackgroundTransparency = 1
	title.Text = "Магазин Tycoon"
	title.TextColor3 = Color3.fromRGB(255, 255, 255)
	title.Font = Enum.Font.GothamBold
	title.TextSize = 20
	title.Parent = frame

	createButton(frame, "2x Деньги (40 Robux)", 60, function()
		MarketplaceService:PromptGamePassPurchase(player, GAMEPASS_DOUBLE_MONEY_ID)
	end)

	createButton(frame, "100,000 Денег (100 Robux)", 120, function()
		MarketplaceService:PromptProductPurchase(player, DEV_PRODUCT_MONEY_100K_ID)
	end)

	createButton(frame, "500,000 Денег (250 Robux)", 180, function()
		MarketplaceService:PromptProductPurchase(player, DEV_PRODUCT_MONEY_500K_ID)
	end)
end

buildShopGui()
