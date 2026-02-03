local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local GAMEPASS_DOUBLE_MONEY_ID = 123456789 -- 40 Robux (замени на свой)
local DEV_PRODUCT_MONEY_100K_ID = 234567890 -- 100 Robux (замени на свой)
local DEV_PRODUCT_MONEY_500K_ID = 345678901 -- 250 Robux (замени на свой)

local BASE_INCOME = 100
local INCOME_INTERVAL = 5

local function getMoneyMultiplier(player)
	local success, ownsPass = pcall(function()
		return MarketplaceService:UserOwnsGamePassAsync(player.UserId, GAMEPASS_DOUBLE_MONEY_ID)
	end)
	if success and ownsPass then
		return 2
	end
	return 1
end

local function setupLeaderstats(player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	local money = Instance.new("IntValue")
	money.Name = "Money"
	money.Value = 0
	money.Parent = leaderstats
end

Players.PlayerAdded:Connect(function(player)
	setupLeaderstats(player)

	task.spawn(function()
		while player.Parent do
			local leaderstats = player:FindFirstChild("leaderstats")
			local money = leaderstats and leaderstats:FindFirstChild("Money")
			if money then
				money.Value += BASE_INCOME * getMoneyMultiplier(player)
			end
			task.wait(INCOME_INTERVAL)
		end
	end)
end)

local function giveMoney(player, amount)
	local leaderstats = player:FindFirstChild("leaderstats")
	local money = leaderstats and leaderstats:FindFirstChild("Money")
	if money then
		money.Value += amount
	end
end

MarketplaceService.ProcessReceipt = function(receiptInfo)
	local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
	if not player then
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end

	if receiptInfo.ProductId == DEV_PRODUCT_MONEY_100K_ID then
		giveMoney(player, 100000)
		return Enum.ProductPurchaseDecision.PurchaseGranted
	end

	if receiptInfo.ProductId == DEV_PRODUCT_MONEY_500K_ID then
		giveMoney(player, 500000)
		return Enum.ProductPurchaseDecision.PurchaseGranted
	end

	return Enum.ProductPurchaseDecision.PurchaseGranted
end
