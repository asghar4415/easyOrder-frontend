import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const menuService = {
  async createFullMenuItem(restaurantId: string, data: any) {
    const token = Cookies.get("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Track created resources for rollback
    const rollbackStack: { type: string; id: string }[] = [];

    try {
      // 1. Handle Category (Create if new, or use existing)
      let categoryId = data.categoryId;
      if (data.isNewCategory) {
        const catRes = await axios.post(`${API_URL}/categories`, {
          name: data.categoryName,
          description: data.categoryDescription,
          restaurantId
        }, config);
        categoryId = catRes.data.category.id;
        
        rollbackStack.push({ type: 'categories', id: categoryId });
      }

      // 2. Create Menu Item
      const itemRes = await axios.post(`${API_URL}/menu-items/create-menuitem`, {
        ...data.itemDetails,
        categoryId
      }, config);
      const menuItemId = itemRes.data.id;
      rollbackStack.push({ type: 'menu-items', id: menuItemId });

      // 3. Create Variants & Options
      for (const variant of data.variants) {
        const varRes = await axios.post(`${API_URL}/variants`, {
          ...variant,
          menuItemId
        }, config);
        const variantId = varRes.data.variant.id;
        rollbackStack.push({ type: 'variants', id: variantId });

        // 4. Create Options for this variant
        for (const option of variant.options) {
          const optRes = await axios.post(`${API_URL}/variants/option`, {
            ...option,
            variantId
          }, config);
          rollbackStack.push({ type: 'variant-options', id: optRes.data.id });
        }
      }

      return itemRes.data;

    } catch (error) {
      // --- ROLLBACK LOGIC ---
      console.error("Creation failed, rolling back...", error);
      // Delete in reverse order of creation
      for (const resource of rollbackStack.reverse()) {
        try {
          await axios.delete(`${API_URL}/${resource.type}/delete/${resource.id}`, config);
        } catch (rollbackError) {
          console.error(`Failed to rollback ${resource.type} ${resource.id}`);
        }
      }
      throw error;
    }
  }
};