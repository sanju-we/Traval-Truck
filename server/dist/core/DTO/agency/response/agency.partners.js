export const toPartnerDTO = (partner) => ({
    id: partner._id.toString(),
    partnerName: partner.PartnerName,
    partnerType: partner.PartnerType,
    contactPerson: partner.ContactPerson,
    status: partner.Status,
    phone: partner.Phone,
    media: partner.media,
    details: partner.details,
    email: partner.Email,
    location: partner.Location,
});
