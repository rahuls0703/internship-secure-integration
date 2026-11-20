/* global apiRequest, validateApplication */
const grid = document.querySelector("#internshipGrid");
const listMessage = document.querySelector("#listMessage");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const domainFilter = document.querySelector("#domainFilter");
const modeFilter = document.querySelector("#modeFilter");
const loadMore = document.querySelector("#loadMore");
const detailsDialog = document.querySelector("#detailsDialog");
const detailsContent = document.querySelector("#detailsContent");
const applicationDialog = document.querySelector("#applicationDialog");
const applicationForm = document.querySelector("#applicationForm");
const formMessage = document.querySelector("#formMessage");

let page = 1, totalPages = 1, debounceTimer, currentRecords = [];
const pageSize = 6;
document.querySelector("#year").textContent = new Date().getFullYear();

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
}
function showMessage(title, text, retry = false) {
  listMessage.hidden = false;
  listMessage.innerHTML = `<h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p>${retry ? '<button class="retry-button" id="retryLoad" type="button">Try again</button>' : ""}`;
  grid.hidden = true;
  loadMore.hidden = true;
}
function clearMessage() { listMessage.hidden = true; listMessage.innerHTML = ""; grid.hidden = false; }
function cardTemplate(item) {
  const initials = item.company.split(" ").map(x => x[0]).join("").slice(0,2).toUpperCase();
  const skills = item.skills.slice(0,3).map(s => `<span>${escapeHTML(s)}</span>`).join(" · ");
  return `<article class="internship-card">
    <div class="card-topline"><div class="company-logo" aria-hidden="true">${escapeHTML(initials)}</div><span class="card-id">${escapeHTML(item.id)}</span></div>
    <h3 class="card-title">${escapeHTML(item.title)}</h3><p class="company-name">${escapeHTML(item.company)}</p>
    <div class="chips"><span class="chip mode">${escapeHTML(item.mode)}</span><span class="chip">${escapeHTML(item.domain)}</span></div>
    <p class="card-skills">${skills}</p><div class="card-footer"><span class="location">⌖ ${escapeHTML(item.location)} · ${escapeHTML(item.duration)}</span>
    <button class="details-button" type="button" data-details="${escapeHTML(item.id)}" aria-label="View details for ${escapeHTML(item.title)}">View details ↗</button></div>
  </article>`;
}
async function loadFilters() {
  const result = await apiRequest("/internships/filters");
  for (const domain of result.data.domains) domainFilter.add(new Option(domain, domain));
  for (const mode of result.data.modes) modeFilter.add(new Option(mode, mode));
}
async function loadInternships({ append = false } = {}) {
  grid.setAttribute("aria-busy", "true");
  if (!append) { grid.innerHTML = ""; page = 1; }
  clearMessage();
  try {
    const params = new URLSearchParams({ page, limit: pageSize, q: searchInput.value.trim(), domain: domainFilter.value, mode: modeFilter.value });
    const response = await apiRequest(`/internships?${params}`);
    const records = response.data;
    currentRecords = append ? [...currentRecords, ...records] : records;
    grid.innerHTML = currentRecords.map(cardTemplate).join("");
    totalPages = response.pagination.totalPages;
    resultCount.textContent = `${response.pagination.total} ${response.pagination.total === 1 ? "opportunity" : "opportunities"} found`;
    loadMore.hidden = page >= totalPages;
    if (!records.length) showMessage("No internships found", "Try another keyword or clear one of your filters.");
  } catch (error) {
    showMessage("Couldn't load internships", error.message || "Check your connection and try again.", true);
    resultCount.textContent = "Listings unavailable";
  } finally { grid.setAttribute("aria-busy", "false"); }
}
async function openDetails(id) {
  detailsContent.innerHTML = '<div class="dialog-content"><p>Loading details…</p></div>';
  detailsDialog.showModal();
  try {
    const { data:item } = await apiRequest(`/internships/${encodeURIComponent(id)}`);
    detailsContent.innerHTML = `<div class="dialog-content"><div class="dialog-head" style="padding:0"><div><p class="eyebrow">${escapeHTML(item.domain)}</p><h2 id="detailsTitle">${escapeHTML(item.title)}</h2><p class="detail-company">${escapeHTML(item.company)} · ${escapeHTML(item.id)}</p></div><button class="icon-close" data-close type="button" aria-label="Close details">×</button></div>
      <div class="detail-meta"><span class="chip mode">${escapeHTML(item.mode)}</span><span class="chip">${escapeHTML(item.location)}</span><span class="chip">${escapeHTML(item.duration)}</span><span class="chip">${escapeHTML(item.stipend || "Stipend not listed")}</span></div>
      <p class="detail-description">${escapeHTML(item.description)}</p>
      <div class="detail-block"><h3>What you'll do</h3><ul>${item.responsibilities.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul></div>
      <div class="detail-block"><h3>What we're looking for</h3><ul>${item.requirements.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul></div>
      <div class="detail-block"><h3>Skills</h3><div class="chips">${item.skills.map(x=>`<span class="chip">${escapeHTML(x)}</span>`).join("")}</div></div>
      <p class="muted">${item.openings} opening${item.openings===1?"":"s"} available</p><button class="apply-now" data-apply="${escapeHTML(item.id)}" data-title="${escapeHTML(item.title)}" type="button">Apply for this internship ↗</button></div>`;
  } catch (error) {
    detailsContent.innerHTML = `<div class="dialog-content"><button class="icon-close" data-close type="button" aria-label="Close">×</button><h2 id="detailsTitle">Unable to load details</h2><p>${escapeHTML(error.message)}</p></div>`;
  }
}
function openApplication(id, title) {
  detailsDialog.close();
  applicationForm.reset();
  document.querySelector("#applicationInternshipId").value = id;
  document.querySelector("#applicationRole").textContent = title;
  formMessage.hidden = true; formMessage.className = "form-message";
  applicationDialog.showModal();
  applicationForm.querySelector("[name=fullName]").focus();
}
function showFieldErrors(errors) {
  for (const el of applicationForm.querySelectorAll("[data-error]")) el.textContent = errors[el.dataset.error] || "";
}
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-details]");
  if (button) openDetails(button.dataset.details);
});
document.addEventListener("click", event => {
  const close = event.target.closest("[data-close]");
  if (close) close.closest("dialog").close();
  const apply = event.target.closest("[data-apply]");
  if (apply) openApplication(apply.dataset.apply, apply.dataset.title);
  if (event.target.id === "retryLoad") loadInternships();
});
searchInput.addEventListener("input", () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(()=>loadInternships(), 250); });
domainFilter.addEventListener("change", ()=>loadInternships());
modeFilter.addEventListener("change", ()=>loadInternships());
document.querySelector("#clearFilters").addEventListener("click",()=>{searchInput.value="";domainFilter.value="";modeFilter.value="";loadInternships();searchInput.focus();});
loadMore.addEventListener("click",()=>{page++;loadInternships({append:true});});
applicationForm.addEventListener("submit", async event => {
  event.preventDefault(); showFieldErrors({});
  const formData = new FormData(applicationForm);
  const errors = validateApplication(formData);
  if (Object.keys(errors).length) { showFieldErrors(errors); formMessage.textContent="Please correct the highlighted fields.";formMessage.className="form-message error";formMessage.hidden=false;return; }
  const submit = applicationForm.querySelector(".submit-button");submit.disabled=true;submit.textContent="Submitting…";
  try {
    const payload = Object.fromEntries(formData.entries());
    const result = await apiRequest("/applications",{method:"POST",body:JSON.stringify(payload)});
    formMessage.textContent=result.message;formMessage.className="form-message success";formMessage.hidden=false;
    applicationForm.reset();
    setTimeout(()=>applicationDialog.close(),1800);
  } catch(error) {
    const serverErrors=error.payload?.data?.errors || {};
    showFieldErrors(serverErrors);
    formMessage.textContent=error.message;formMessage.className="form-message error";formMessage.hidden=false;
  } finally {submit.disabled=false;submit.innerHTML='Submit application <span aria-hidden="true">↗</span>';}
});
document.addEventListener("keydown",event=>{
  if ((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();searchInput.focus();}
});
Promise.all([loadFilters(),loadInternships()]).catch(error=>showMessage("Setup error",error.message,true));
