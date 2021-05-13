json.meta do
  json.total_count @total_items
  json.page @page
  json.per @per
end
json.data @players
