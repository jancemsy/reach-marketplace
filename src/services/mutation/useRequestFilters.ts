import {NewsFilterEntity} from "../type.interface";

export const NewsFilter = (filter: NewsFilterEntity) => {
    let param = "";
    
    if(filter){
        param = filter.StartsAfter != undefined ? "StartsAfter=" + filter.StartsAfter : "";
        param += filter.StartsBefore != undefined ? param ? ("&StartsBefore=" + filter.StartsBefore) : "StartsBefore=" + filter.StartsBefore : "";
        param += filter.UnreadOnly != undefined ? param ? ("&UnreadOnly=" + filter.UnreadOnly) : "UnreadOnly=" + filter.UnreadOnly : "";
        param += filter.BookmarksOnly != undefined ? param ? ("&BookmarksOnly=" + filter.BookmarksOnly) : "BookmarksOnly=" + filter.BookmarksOnly : "";
        param += filter.Channels != undefined ? param ? ("&Channels=" + filter.Channels) : "Channels=" + filter.Channels : "";
        param += filter.Search != undefined ? param ? ("&Search=" + filter.Search) : "Search=" + filter.Search : "";
        param += filter.SearchInTitlesOnly != undefined ? param ? ("&SearchInTitlesOnly=" + filter.SearchInTitlesOnly) : "SearchInTitlesOnly=" + filter.SearchInTitlesOnly : "";
        param += filter.Owner != undefined ? param ? ("&Owner=" + filter.Owner) : "Owner=" + filter.Owner : "";
        param += filter.ModifiedSince != undefined ? param ? ("&ModifiedSince=" + filter.ModifiedSince) : "ModifiedSince=" + filter.ModifiedSince : "";
        param += filter.Token != undefined ? param ? ("&Token=" + filter.Token) : "Token=" + filter.Token : "";
        param += filter.PageSize != undefined ? param ? ("&PageSize=" + filter.PageSize) : "PageSize=" + filter.PageSize : "";
        param += filter.BeforeDate != undefined ? param ? ("&BeforeDate=" + filter.BeforeDate) : "BeforeDate=" + filter.BeforeDate : "";
        param += filter.IsFirstPage != undefined ? param ? ("&IsFirstPage=" + filter.IsFirstPage) : "IsFirstPage=" + filter.IsFirstPage : "";
        param += filter.Keywords != undefined ? param ? ("&Keywords=" + filter.Keywords) : "Keywords=" + filter.Keywords : "";
        param += filter.SubscribedOnly != undefined ? param ? ("&SubscribedOnly=" + filter.SubscribedOnly.toString()) : "SubscribedOnly=" + filter.SubscribedOnly.toString() : "";
    }
    return param ? ("?" + param) : "";
}