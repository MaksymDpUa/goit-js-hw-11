import { search } from "./search";
import { createMarkUp } from "./createMarkUp";

function startMarkUp() {
    search().then(imagies => {
    gallery.insertAdjacentHTML('beforeend', createMarkUp(imagies.hits))
    observer.observe(guard)
});
}

export {startMarkUp}