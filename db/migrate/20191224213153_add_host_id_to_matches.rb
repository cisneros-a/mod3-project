class AddHostIdToMatches < ActiveRecord::Migration[6.0]
  def change
    add_column :matches, :host_id, :integer
  end
end
