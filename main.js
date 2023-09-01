const categoryContainer = document.getElementById('category-container');
const videosContainer = document.getElementById('videos-container');
const noDataContainer = document.getElementById('no-data-container');
const postedDateContainer = document.getElementById('posted-date');
const sortByViewBtn = document.getElementById('sort-view');

const showAllCategory = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const data = await response.json();
    const allCategory = data.data;

    allCategory.forEach((category) => {
        const div = document.createElement('div');
        div.classList = 'flex justify-center gap-3 md:gap-5';
        div.innerHTML = `
            <button onclick="allDataByCategoryId ('${category.category_id}')" class="px-3 md:px-5 py-1 md:py-2 rounded-lg bg-gray-c text-base md:text-lg font-medium">
                ${category.category}
            </button>`;

        categoryContainer.appendChild(div)
    })
}


const allDataByCategoryId = async (categoryId) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
    const data = await response.json();
    const categoryAllDataItems = data.data;

    videosContainer.innerHTML = '';

    if (data.data.length === 0) {
        noDataContainer.classList.remove('hidden')
    } else {
        noDataContainer.classList.add('hidden')
    }

    // Show data by clicking categories.
    categoryAllDataItems.forEach((categoryDataItem) => {
        const div = document.createElement('div');
        div.classList = 'w-80 md:w-60 pb-3 cursor-pointer';
        div.innerHTML = `
            <div class="w-full h-44 md:h-36 mb-5 relative">
                <img src="${categoryDataItem?.thumbnail}" alt="" class="w-full h-full object-cover rounded-lg">
                <p id="posted-date" class="video-relased bg-black text-white text-xs px-1">
                    ${showPostedDate(categoryDataItem?.others?.posted_date)}
                </p>
            </div>

            <div class="flex gap-3">
                <div class="w-10 md:w-8">
                    <img src="${categoryDataItem?.authors[0]?.profile_picture}" alt=""
                        class="w-10 md:w-8 h-10 md:h-8 object-cover rounded-full">
                </div>

                <div class="w-72 md:w-52">
                    <h1 class="text-lg md:text-base font-bold mb-2">
                        ${categoryDataItem.title}
                    </h1>

                    <div class="flex gap-x-2">
                        <p class="text-gray-500 md:text-base text-sm">
                        ${categoryDataItem?.authors[0]?.profile_name}
                        </p>

                        ${categoryDataItem?.authors[0]?.verified ? '<i class="ri-verified-badge-fill text-base md:text-xl text-blue-600"></i>' : ''}                        
                    </div>

                    <p class="text-gray-500 md:text-base text-sm -mt-1 md:-mt-1 video-card">
                        ${categoryDataItem.others.views} views
                    </p>
                </div>
            </div>`;

        videosContainer.appendChild(div)
    })

    // Sort by view functionality
    sortByViewBtn.addEventListener('click', () => {
        const convertCategoryDataViews = categoryAllDataItems.map(categoryDataTtem => ({
            ...categoryDataTtem, views: convertViews(categoryDataTtem.others.views)
        }));

        const sortCategoryItemByViews = convertCategoryDataViews.slice().sort((item1, item2) => item2.views - item1.views);

        videosContainer.innerHTML = '';

        sortCategoryItemByViews.forEach((categoryDataItem) => {
            const div = document.createElement('div');
            div.classList = 'w-80 md:w-60 pb-3 cursor-pointer';
            div.innerHTML = `
                <div class="w-full h-44 md:h-36 mb-5 relative">
                    <img src="${categoryDataItem?.thumbnail}" alt="" class="w-full h-full object-cover rounded-lg">
                    <p id="posted-date" class="video-relased bg-black text-white text-xs px-1">${showPostedDate(categoryDataItem?.others?.posted_date)}</p>
                </div>
    
                <div class="flex gap-3">
                    <div class="w-10 md:w-8">
                        <img src="${categoryDataItem?.authors[0]?.profile_picture}" alt=""
                            class="w-10 md:w-8 h-10 md:h-8 object-cover rounded-full">
                    </div>
    
                    <div class="w-72 md:w-52">
                        <h1 class="text-lg md:text-base font-bold mb-2">
                            ${categoryDataItem.title}
                        </h1>
    
                        <div class="flex gap-x-2">
                            <p class="text-gray-500 md:text-base text-sm">
                            ${categoryDataItem?.authors[0]?.profile_name}
                            </p>
    
                            ${categoryDataItem?.authors[0]?.verified ? '<i class="ri-verified-badge-fill text-base md:text-xl text-blue-600"></i>' : ''}                        
                        </div>
    
                        <p class="text-gray-500 md:text-base text-sm -mt-1 md:-mt-1 video-card">
                            ${categoryDataItem.others.views} views
                        </p>
                    </div>
                </div>`;

            videosContainer.appendChild(div)
        });
    });

    const convertViews = (views) => {
        return views.includes('k') ? (parseFloat(views) * 1000) : (parseFloat(views));
    }
}

const showPostedDate = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    return seconds === '' ? '' : `${hours} hrs ${mins} min ago`;
}


showAllCategory();
allDataByCategoryId('1000')