export const toPartnerDTO = (partner) => ({
    id: partner._id.toString(),
    partnerName: partner.PartnerName,
    PartnerType: partner.PartnerType,
    contactPerson: partner.ContactPerson,
    status: partner.Status,
    phone: partner.Phone,
    media: partner.Media,
    details: partner.Details,
    email: partner.Email,
    location: partner.Location,
    partner: partner.partner
});
