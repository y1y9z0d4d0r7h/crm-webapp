// js/toast.js

// ========== Toast Notification ==========
export function showToast(message, type = "success") {
  const existing = document.getElementById("crm-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "crm-toast";

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const icon = type === "success" ? "✅" : "❌";

  toast.className = `
    fixed top-6 right-6 z-50 
    ${bgColor} text-white 
    px-5 py-3 rounded-lg shadow-lg 
    flex items-center gap-3
    text-sm font-medium
    transition-all duration-300
    opacity-0 translate-x-10
  `;

  toast.innerHTML = `
    <span class="text-lg">${icon}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-x-10");
    toast.classList.add("opacity-100", "translate-x-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-10");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========== Custom Confirm Dialog ==========
export function showConfirm(message = "Are you sure?") {
  return new Promise((resolve) => {
    // Remove existing confirm if any
    const existing = document.getElementById("crm-confirm");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "crm-confirm";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40";

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Confirm</h3>
        <p class="text-gray-600 mb-6">${message}</p>
        <div class="flex justify-end gap-3">
          <button id="confirm-cancel" class="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button id="confirm-ok" class="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Button events
    document.getElementById("confirm-cancel").onclick = () => {
      modal.remove();
      resolve(false);
    };

    document.getElementById("confirm-ok").onclick = () => {
      modal.remove();
      resolve(true);
    };
  });
}