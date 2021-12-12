module PaginationConcern
  extend ActiveSupport::Concern

  private

  def paginate(query_results)
    query_results.offset(offset_index*page_size).limit(page_size)
  end

  def pagination_metadata_for(paginated_results)
    {
      current_page: page_number,
      total_hits: paginated_results.count,
      total_pages: (paginated_results.count / page_size).ceil
    }
  end

  def page_size
    20
  end

  def offset_index
    page_number - 1
  end

  def page_number
    int_page = page_param.to_i
    int_page.zero? ? 1 : int_page
  end

  def page_param
    params[:page]
  end
end