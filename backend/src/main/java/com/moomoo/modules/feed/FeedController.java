package com.moomoo.modules.feed;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/api/feed-records")
    public List<FeedRecord> records() {
        return feedService.records();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','ENTRY')")
    @PostMapping("/api/feed-records")
    public FeedRecord createRecord(@RequestParam UUID animalId, @RequestParam(required = false) UUID feedTypeId,
                                   @RequestBody FeedRecord record) {
        return feedService.createRecord(animalId, feedTypeId, record);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/api/feed-types")
    public List<FeedType> feedTypes() {
        return feedService.feedTypes();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/api/feed-types")
    public FeedType createFeedType(@RequestBody FeedType feedType) {
        return feedService.createFeedType(feedType);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/api/feed-inventory")
    public List<FeedInventory> inventory() {
        return feedService.inventory();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/api/feed-inventory/{id}")
    public FeedInventory updateInventory(@PathVariable UUID id, @RequestBody FeedInventory payload) {
        return feedService.updateInventory(id, payload);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/api/feed/ai-recommend/{animalId}")
    public Map<String, Object> recommend(@PathVariable UUID animalId) {
        return feedService.recommend(animalId);
    }
}
