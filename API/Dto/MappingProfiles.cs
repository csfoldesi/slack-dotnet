using Domain;

namespace API.Dto;

public class MappingProfiles : AutoMapper.Profile
{
    public MappingProfiles()
    {
        CreateMap<User, UserProfile>();
    }
}
