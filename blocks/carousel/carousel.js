import { getMetadata } from '../../scripts/lib-franklin.js';

const DEFAULT_SEGMENT_DURATION = 30 * 1000; // Duration in milliseconds for each segment
const DEFAULT_ITEM_DURATION = 10 * 1000;

const getSegmentDuration = (segment) => {
    const segmentDuration = segment.getAttribute('data-carousel-segment-duration');
    return segmentDuration ? parseInt(segmentDuration, 10) * 1000 : DEFAULT_SEGMENT_DURATION;
}

const getItemDuration = (segment) => {
    const itemDuration = segment.getAttribute('data-carousel-item-duration');
    return itemDuration ? parseInt(itemDuration, 10) * 1000 : DEFAULT_ITEM_DURATION;
}

export default function decorate(block) {
    let carouselTrack = document.querySelector(".carousel-track");
    let carouselSegments = document.querySelectorAll(".carousel-segment");
    let currentIndexes = Array.from(carouselSegments, () => -1);
    const totalItems = Array.from(carouselSegments,
        (segment) => segment.querySelectorAll(".carousel-item").length
    );
    const offSet = [];
    offSet.push(0);
    for (let i = 1; i < totalItems.length; i++) {
        offSet.push(offSet[i - 1] + totalItems[i-1]);
    }

    const itemWidth = block.querySelector(".carousel-item").offsetWidth;

    let currentSegmentIndex = -1;

    function showSlide(segmentIndex, itemIndex) {
        if (segmentIndex < 0 || segmentIndex >= carouselSegments.length) {
            nextSegment();
            return;
        }

        if (totalItems[segmentIndex] === 0 || itemIndex < 0 || itemIndex >= totalItems[segmentIndex]) {
            nextSegment();
            return;
        }

        let translateX = -(itemIndex+offSet[segmentIndex]) * itemWidth;
        carouselTrack.style.transform = "translateX(" + translateX + "px)";

        currentSegmentIndex = segmentIndex;
        currentIndexes[segmentIndex] = itemIndex;
        console.log("Segment: " + currentSegmentIndex + ", Item: " + itemIndex + "at " + new Date().toLocaleString());
    }

    function nextSlideInSegment() {
        let newIndex = (currentIndexes[currentSegmentIndex] + 1) % totalItems[currentSegmentIndex];
        showSlide(currentSegmentIndex, newIndex);
        setTimeout(nextSlideInSegment, getItemDuration(carouselSegments[currentSegmentIndex]));
    }

    function nextSegment() {
        currentSegmentIndex = (currentSegmentIndex + 1) % carouselSegments.length;
        setTimeout(nextSegment, getSegmentDuration(carouselSegments[currentSegmentIndex]));
    }

    // Start the carousel by showing the initial slide
    nextSegment();
    nextSlideInSegment();
}
